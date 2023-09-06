import { useEditor, useValue } from '@tldraw/editor'
import React, { useEffect, useState } from 'react'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import { Button } from '../primitives/Button'
import { getRelevantStyles } from './StylePanel'
import './colorpicker.css'

// interface for color picker buttons
export interface ColorPickerButtons {
	[key: string]: string
}

export const ColorPickerPanel = ({
	handleCustomColorValueChange,
}: {
	handleCustomColorValueChange: (val: string) => void
}) => {
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
		handleCustomColorValueChange(e.currentTarget.value)
	}

	useEffect(() => {}, [color])

	// Disable like stylepanel and enable
	const editor = useEditor()
	const relevantStyles = useValue('getRelevantStyles', () => getRelevantStyles(editor), [editor])

	if (!relevantStyles) return null

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
