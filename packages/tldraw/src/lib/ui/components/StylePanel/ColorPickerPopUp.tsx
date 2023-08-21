import { GeoShapeGeoStyle, useEditor, useValue } from '@tldraw/editor'
import { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { useUiEvents } from '../../hooks/useEventsProvider'
import { TLUiToolItem } from '../../hooks/useTools'
import { ToolbarButton, isActiveTLUiToolItem } from '../Toolbar/Toolbar'

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

	return (
		<div className="">
			<div className="colorIndex" style={colorPickerStyles.div}>
				<HexColorPicker color={color} style={colorPickerStyles.colorIndex} onChange={setColor} />
			</div>
			<div style={colorPickerStyles.div}>
				<input
					ref={inputRef}
					type="text"
					style={colorPickerStyles.input}
					placeholder={'# HEX VALUE'}
					onKeyDown={handleHexChoose}
				/>
				<ToolbarButton
					key={toolItem.id}
					item={toolItem}
					title={'Color Picker'}
					isSelected={isActiveTLUiToolItem(toolItem, activeToolId, geoState)}
				/>
			</div>

			{/* <Button icon='tool-colopicker' key={'colorpicker-button'} label={"HI"}/> */}
			{/* <button style={colorPickerStyles.button} onClick={handleColorPickerButtonClick}>
				CLR
			</button> */}
		</div>
	)
}
