import { DefaultColorStyle, DefaultColorThemePalette, Editor, useEditor } from '@tldraw/editor'
import React, { useEffect, useState } from 'react'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import { Button } from '../primitives/Button'
import './colorpicker.css'

// interface for color picker buttons
export interface ColorPickerButtons {
	[key: string]: string
}

export const ColorPickerPanel = () => {
	const editor = useEditor()
	const [color, setColor] = useState('#ff00aa')

	const [listItems, setListItems] = useState<ColorPickerButtons>({
		colorpickerButton1: 'Red',
		colorpickerButton2: 'Blue',
		colorpickerButton3: 'Yellow',
		colorpickerButton4: 'Pink',
	})

	const handleCustomButtonClick = (e: React.PointerEvent<HTMLButtonElement>, key: string) => {
		e.currentTarget.value = listItems[key]
	}

	const setCustomHexValue = (e: any) => {
		console.log(e.currentTarget.value)
		setCustomColors(editor, '#' + e.currentTarget.value)
	}

	useEffect(() => {
		// console.log(color)
		setCustomColors(editor, color)
	}, [color])

	return (
		<div className="tlui-style-panel tlui-color-panel">
			<div className="tlui-colorpickerpopup__custom-buttons">
				<ButtonOptions listItems={listItems} handleCustomButtonClick={handleCustomButtonClick} />
			</div>
			<div className="tlui-colorpickerpopup__colorindex">
				<HexColorPicker
					color={color}
					onChange={setColor}
					className="react-colorful__hexcolorpicker"
				/>
			</div>
			<div className="tlui-colorpickerpopup__hexcolorinput">
				<HexColorInput
					color={color}
					onChange={setColor}
					onKeyDown={setCustomHexValue}
					className="tlui-colorpickerpopup__inputfield"
				/>
			</div>
		</div>
	)
}

const ButtonOptions = ({
	listItems,
	handleCustomButtonClick,
}: {
	listItems: Object
	handleCustomButtonClick: (val: any, key: string) => void
}) => {
	return (
		<>
			{Object.keys(listItems).map((key) => {
				return (
					<Button
						key={key}
						icon="color"
						style={{ color: (listItems as any)[key] }}
						title={(listItems as any)[key]}
						onClick={(e: any) => handleCustomButtonClick(e, key)}
					/>
				)
			})}
		</>
	)
}

const setCustomColors = (editor: Editor, value: string) => {
	DefaultColorThemePalette.darkMode['custom-color'].solid = value
	DefaultColorThemePalette.darkMode['custom-color'].semi = value
	DefaultColorThemePalette.darkMode['custom-color'].pattern = value
	DefaultColorThemePalette.darkMode['custom-color'].highlight.srgb = value

	DefaultColorThemePalette.lightMode['custom-color'].solid = value
	DefaultColorThemePalette.lightMode['custom-color'].semi = value
	DefaultColorThemePalette.lightMode['custom-color'].pattern = value
	DefaultColorThemePalette.lightMode['custom-color'].highlight.srgb = value

	editor.setStyle(DefaultColorStyle, 'custom-color')
}
