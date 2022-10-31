'use strict';
const React = require('react');
const { useInput, Text, Box } = require('ink');

const App = (props) => {
	const { links } = props
	const [searchData, setSearchData] = React.useState(links)
	const [y, setY] = React.useState(0)
	const [text, setText] = React.useState('')
	const [queueIndex, setQueueIndex] = React.useState(-1)
	const [isSearch, setIsSearch] = React.useState(!links.length)

	useInput(async (input, key) => {
		if (input && isSearch) {
			setText(text + input)
		}
		if (input === 's' & !text) {
			setIsSearch(true)
		}
		if (input === 'q' && !text && !isSearch) {
			props.handleAddToQueue(y)
			setQueueIndex(y)
			setTimeout(() => {
				setQueueIndex(-1)
			}, 500)
		}
		if (key.upArrow) {
			setY(Math.max(0, y - 1));
		}
		if (key.downArrow) {
			setY(Math.min(searchData.length - 1, y + 1));
		}
		if (key.backspace || key.delete) {
			if (text)
				setText(text.slice(0, -1))
			else {
				if (searchData.length) setIsSearch(false)
			}
		}
		if (key.return) {
			let data
			if (text) {
				data = await props.handleSearch(text)
				setY(0)
				setText('')
				setIsSearch(false)
			} else {
				data = await props.handleSelect(y)
			}
			setSearchData(data)
		}
	})
	if (!isSearch)
		return (
			<Box flexDirection="column">
				<Box flexDirection="column" borderStyle="single">
					{searchData.map((item, index) => {
						return (
							<Box key={index}>
								<Text backgroundColor={y === index ? (queueIndex === index ? "red" : "green") : ""}>
									{item.isPlaying ? "𝄞" : ""} {item.title}
								</Text>
							</Box>
						)
					})}
				</Box>
				<Box>
					<Text>Press: [s] to search | [q] to add to queue | ↕ to select | [Enter] to choose</Text>
				</Box>
			</Box>
		)
	else
		return (
			<Box flexDirection="column">
				<Box borderStyle="single">
					<Text>Search: {text}</Text>
				</Box>
				<Text>Press: Backspace to return | Enter to search</Text>
			</Box>
		)
};

module.exports = App;
