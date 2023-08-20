import { GeoShapeGeoStyle, useEditor, useValue } from '@tldraw/editor'
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
}

/*
export interface TLUiToolItem {
	id: string
	label: TLUiTranslationKey
	shortcutsLabel?: TLUiTranslationKey
	icon: TLUiIconType
	onSelect: (source: TLUiEventSource) => void
	kbd?: string
	readonlyOk: boolean
	meta?: {
		[key: string]: any
	}
}
*/

export const ColorPickerPopUp = ({
	handleColorPickerButtonClick,
	handleHexChoose,
}: ColorPickerProps) => {
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

	return (
		<div className="" style={colorPickerStyles.div}>
			<input
				type="text"
				style={colorPickerStyles.input}
				placeholder={'# HEX VALUE'}
				onKeyDown={handleHexChoose}
			/>
			<ToolbarButton
				key={toolItem.id}
				item={toolItem}
				title={'COlor Picker'}
				isSelected={isActiveTLUiToolItem(toolItem, activeToolId, geoState)}
			/>
			{/* <Button icon='tool-colopicker' key={'colorpicker-button'} label={"HI"}/> */}
			{/* <button style={colorPickerStyles.button} onClick={handleColorPickerButtonClick}>
				CLR
			</button> */}
		</div>
	)
}
