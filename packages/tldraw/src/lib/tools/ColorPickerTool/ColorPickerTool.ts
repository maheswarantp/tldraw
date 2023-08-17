// import { StateNode } from '@tldraw/editor'
// import { Erasing } from './children/Erasing'
// import { Idle } from './children/Idle'
// import { Pointing } from './children/Pointing'

// /** @public */
// export class ColorPickerTool extends StateNode {
// 	static override id = 'colorpicker'
// 	static override initial = 'idle'
// 	static override children = () => [Idle, Pointing, Erasing]

// 	override onEnter = () => {
// 		this.editor.setCursor({ type: 'tool-colorpicker', rotation: 0 })
// 	}
// }

import { DefaultColorStyle, HIT_TEST_MARGIN, StateNode, TLEventHandlers } from '@tldraw/editor'

export class ColorPickerTool extends StateNode {
	static override id = 'colorpicker'
	static override initial = 'idle'

	override onEnter = () => {
		this.editor.setCursor({ type: 'tool-colorpicker', rotation: 0 })
	}

	override onPointerUp: TLEventHandlers['onPointerUp'] = (info) => {
		const {
			zoomLevel,
			focusedGroupId,
			selectedShapeIds,
			inputs: { currentPagePoint, shiftKey },
		} = this.editor

		const hitShape =
			this.editor.getShapeAtPoint(currentPagePoint, {
				margin: HIT_TEST_MARGIN / zoomLevel,
				hitInside: true,
			}) ?? null

		const selectingShape = hitShape ? this.editor.getOutermostSelectableShape(hitShape) : null

		if (selectingShape) {
			this.editor.setStyle(DefaultColorStyle, (selectingShape.props as any).color)
		}
	}
}
