'use strict';
const React = require('react');
const { useInput, Text, Box } = require('ink');

const App = (props) => {
	const { links } = props
	const [searchData, setSearchData] = React.useState(links)
	const [y, setY] = React.useState(0)
	const [text, setText] = React.useState('')
	const [isSearch, setIsSearch] = React.useState(!links.length)
	const [again, setAgain] = React.useState(false)

	useInput(async (input, key) => {
		if (input && isSearch) {
			setText(text + input)
		}
		if (input === 's' & !text) {
			setIsSearch(true)
		}
		if (input === 'q' && !text && !isSearch) {
			props.handleAddToQueue(y)
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
			if (text) {
				let data = await props.handleSearch(text)
				setSearchData(data)
				setY(0)
				setText('')
				setIsSearch(false)
			} else {
				props.handleSelect(y)
				setAgain(!again)
			}
		}
	})
	if (!isSearch)
		return (
			<Box flexDirection="column">
				<Box flexDirection="column" borderStyle="single">
					{searchData.map((item, index) => {
						return (
							<Box key={index}>
								<Text backgroundColor={y === index ? "green" : ""}>{item.isPlaying ? "𝄞" : ""} {item.title}</Text>
							</Box>
						)
					})}
				</Box>
				<Box>
					<Text>Press: S to search | Q to add to queue | ↕ to select | Enter to choose</Text>
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
