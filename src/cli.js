#!/usr/bin/env node
'use strict';
const meow = require('meow')
const React = require('react')
const importJsx = require('import-jsx')
const { render } = require('ink')
const puppeteer = require('puppeteer')
const yt = require('youtube-search-without-api-key')

const ui = importJsx('./ui')

const LINK_PLAYER = 'file://' + __dirname + '/index.html?v='

const cli = meow(
  `Options
  --search -s Name
  --help -h Description`,
  {
    helpText: '',
    flags: {
      importMeta: true,
      search: {
        type: 'string',
        alias: 's'
      },
      help: {
        alias: 'h'
      },
    }
  }
);

const getLinks = async (searchText) => {
	const videos = await yt.search(searchText)
	return videos
}

const playSound = async (pagePlayer, id) => {
	await pagePlayer.goto(LINK_PLAYER + id, {
		waitUntil: 'networkidle0',
	})
	await pagePlayer.waitForSelector("iframe")
	const offset = {x: 226, y: 124};
	await pagePlayer.mouse.click(offset.x, offset.y)
}

const renderList = async (pagePlayer, searchText) => {
	const queue = []
	let links = []
	if (searchText)
		links = await getLinks(searchText)

	render(React.createElement(
		ui,
		{
			links,
			handleSelect: async (index) => {
				for (let i = 0; i < links.length; i++) {
					links[i].isPlaying = false
				}
				links[index].isPlaying = true
				await playSound(pagePlayer, links[index].id.videoId)
				pagePlayer.on('console', async msg => {
					if (queue.length && msg.text() === 'stopped') {
						await playSound(pagePlayer, queue[0].id.videoId)
						queue.shift()
					}
				})
			},
			handleAddToQueue: (index) => {
				queue.push(links[index])
			},
			handleSearch: async (text) => {
				links = await getLinks(text)
				return links
			}
		}
	))
}

(async () => {
	try {
		const searchText = cli.flags.search || cli.flags.s
		const browser = await puppeteer.launch({
			headless: true,
			ignoreDefaultArgs: ['--mute-audio'],
		})
		const pagePlayer = await browser.newPage()
		await renderList(pagePlayer, searchText)
	} catch (err) {
		console.log(err)
	}
})()
