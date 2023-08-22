import { GeoShapeGeoStyle, useEditor, useValue } from '@tldraw/editor'
import { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { useUiEvents } from '../../hooks/useEventsProvider'
import { TLUiToolItem } from '../../hooks/useTools'
import { ToolbarButton, isActiveTLUiToolItem } from '../Toolbar/Toolbar'
import { Button } from '../primitives/Button'

// ColorPickerStyleMap
const colorPickerStyles = {
	div: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '10rem',
	},
	colorIndex: {
		width: '100%',
		height: '100%',
		padding: '10% 5% 0 5%',
	},
	input: {
		width: '90%',
		borderRadius: '10px',
		height: '3rem',
		marginLeft: '5%',
		alignSelf: 'center',
	},
	button: {
		height: '3rem',
		alignSelf: 'center',
		marginRight: '5%',
	},
}

// ColorPickerProps
interface ColorPickerProps {
	handleColorPickerButtonClick: (e: any) => void
	handleHexChoose: (e: any) => void
	handleHexColorIndex: (val: string) => void
}

export const ColorPickerPopUp = ({
	handleColorPickerButtonClick,
	handleHexChoose,
	handleHexColorIndex,
}: ColorPickerProps) => {
	const [color, setColor] = useState('#000000')

	const inputRef = useRef<HTMLInputElement | null>(null)

	const editor = useEditor()
	const activeToolId = useValue('current tool id', () => editor.currentToolId, [editor])
	const geoState = useValue('geo', () => editor.sharedStyles.getAsKnownValue(GeoShapeGeoStyle), [
		editor,
	])

	const trackEvent = useUiEvents()

	const toolItem: TLUiToolItem = {
		id: 'colorpicker',
		icon: 'tool-colorpicker',
		label: 'tool.colorpicker',
		readonlyOk: true,
		onSelect(source) {
			editor.setCurrentTool('colorpicker')
			trackEvent('select-tool', { source, id: 'colorpicker' })
		}, // title: 'Color Picker',
	}

	useEffect(() => {
		// handleHexColorIndex(color)
		if (inputRef.current) inputRef.current.value = color
	}, [color])

	// listItems
	interface ColorPickerButtons {
		[key: string]: string
	}

	const [listItems, setListItems] = useState<ColorPickerButtons>({
		colorpickerButton1: 'Red',
		colorpickerButton2: 'Blue',
		colorpickerButton3: 'Yellow',
		colorpickerButton4: 'Pink',
		colorpickerButton5: 'Green',
	})

	const [count, setCount] = useState(1)

	const handleHexChooseBasic = (e: any) => {
		// Change the list items
		if (e.key === 'Enter') {
			const keyToUpdate = Object.keys(listItems).find((obj) => `colorpickerButton${count}` === obj)
			if (keyToUpdate !== undefined) listItems[keyToUpdate] = e.currentTarget.value
			count < 5 ? setCount(count + 1) : setCount(1)
			handleHexChoose(e)
		}
	}

	const handleCustomButtonClick = (e: any, key: string) => {
		e.currentTarget.value = listItems[key]
		handleHexChoose(e)
	}

	return (
		<div className="">
			<div style={{ display: 'flex' }}>
				<ButtonOptions listItems={listItems} handleCustomButtonClick={handleCustomButtonClick} />
			</div>
			<div className="colorIndex" style={colorPickerStyles.div}>
				<HexColorPicker color={color} style={colorPickerStyles.colorIndex} onChange={setColor} />
			</div>
			<div style={colorPickerStyles.div}>
				<input
					ref={inputRef}
					type="text"
					style={colorPickerStyles.input}
					placeholder={'# HEX VALUE'}
					onKeyDown={handleHexChooseBasic}
				/>
				<ToolbarButton
					key={toolItem.id}
					item={toolItem}
					title={'Color Picker'}
					isSelected={isActiveTLUiToolItem(toolItem, activeToolId, geoState)}
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
