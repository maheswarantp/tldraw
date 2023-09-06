import {
	DefaultColorStyle,
	SharedStyle,
	StyleProp,
	TLDefaultColorStyle,
	clamp,
	getDefaultColorTheme,
	useEditor,
	useValue,
} from '@tldraw/editor'
import classNames from 'classnames'
import * as React from 'react'
import { useRef } from 'react'
import { TLUiTranslationKey } from '../../hooks/useTranslation/TLUiTranslationKey'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'
import { TLUiIconType } from '../../icon-types'
import { StyleValuesForUi } from '../StylePanel/styles'
import { Button } from './Button'

/** @internal */
export interface ButtonPickerProps<T extends string> {
	title: string
	uiType: string
	style: StyleProp<T>
	value: SharedStyle<T>
	items: StyleValuesForUi<T>
	columns?: 2 | 3 | 4
	onValueChange: (style: StyleProp<T>, value: T, squashing: boolean) => void
	handlePopUp?: () => void
}

function _ButtonPicker<T extends string>(props: ButtonPickerProps<T>) {
	const {
		uiType,
		items,
		title,
		style,
		value,
		columns = clamp(items.length, 2, 4),
		onValueChange,
		handlePopUp,
	} = props
	const editor = useEditor()
	const msg = useTranslation()

	const rPointing = useRef(false)

	const {
		handleButtonClick,
		handleButtonPointerDown,
		handleButtonPointerEnter,
		handleButtonPointerUp,
		handleCustomColorButtonPointerDown,
		handleCustomColorButtonPointerUp,
	} = React.useMemo(() => {
		const handlePointerUp = () => {
			rPointing.current = false
			window.removeEventListener('pointerup', handlePointerUp)
		}

		const handleButtonClick = (e: React.PointerEvent<HTMLButtonElement>) => {
			const { id } = e.currentTarget.dataset
			if (value.type === 'shared' && value.value === id) return

			editor.mark('point picker item')
			onValueChange(style, id as T, false)
		}

		const handleButtonPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
			const { id } = e.currentTarget.dataset

			editor.mark('point picker item')
			onValueChange(style, id as T, true)

			rPointing.current = true
			window.addEventListener('pointerup', handlePointerUp) // see TLD-658
		}

		const handleButtonPointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
			if (!rPointing.current) return

			const { id } = e.currentTarget.dataset
			onValueChange(style, id as T, true)
		}

		const handleButtonPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
			const { id } = e.currentTarget.dataset
			onValueChange(style, id as T, false)
		}

		// Create custom handlers for custom color button
		const handleCustomColorButtonPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
			// Handle the custom color button pointer down
			const { id } = e.currentTarget.dataset

			editor.mark('point picker item')
			onValueChange(style, id as T, true)

			handlePopUp?.() // Handle popup

			rPointing.current = true
			window.addEventListener('pointerup', handlePointerUp) // see TLD-658
		}

		const handleCustomColorButtonPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
			// Handle custom color button pointer up
			const { id } = e.currentTarget.dataset
			onValueChange(style, id as T, false)
		}

		return {
			handleButtonClick,
			handleButtonPointerDown,
			handleButtonPointerEnter,
			handleButtonPointerUp,
			handleCustomColorButtonPointerDown,
			handleCustomColorButtonPointerUp,
		}
	}, [value, editor, onValueChange, style])

	const theme = useValue(
		'theme',
		() => getDefaultColorTheme({ isDarkMode: editor.user.isDarkMode }),
		[editor]
	)

	// Custom Color Button
	const CustomColorButton = (props: CustomButtonProps) => {
		const { item } = props
		return (
			<Button
				key={`custom-color:${item.value}`}
				data-id={item.value}
				data-testid={`style.${uiType}.${item.value}`}
				aria-label={item.value}
				data-state={value.type === 'shared' && value.value === item.value ? 'hinted' : undefined}
				title={title + ' — ' + msg(`${uiType}-style.${item.value}` as TLUiTranslationKey)}
				className={classNames('tlui-button-grid__button')}
				style={
					style === (DefaultColorStyle as StyleProp<unknown>)
						? { color: theme['custom-color'].solid }
						: undefined
				}
				onPointerEnter={handleButtonPointerEnter}
				onPointerDown={handleCustomColorButtonPointerDown}
				onPointerUp={handleCustomColorButtonPointerUp}
				onClick={handleButtonClick}
				icon={item.icon as TLUiIconType}
			/>
		)
	}

	return (
		<div
			className={classNames('tlui-button-grid', {
				'tlui-button-grid__two': columns === 2,
				'tlui-button-grid__three': columns === 3,
				'tlui-button-grid__four': columns === 4,
			})}
		>
			{items.map((item) =>
				item.value === 'custom-color' ? (
					<CustomColorButton item={item} key="custom-color-button" />
				) : (
					<Button
						key={item.value}
						data-id={item.value}
						data-testid={`style.${uiType}.${item.value}`}
						aria-label={item.value}
						data-state={
							value.type === 'shared' && value.value === item.value ? 'hinted' : undefined
						}
						title={title + ' — ' + msg(`${uiType}-style.${item.value}` as TLUiTranslationKey)}
						className={classNames('tlui-button-grid__button')}
						style={
							style === (DefaultColorStyle as StyleProp<unknown>)
								? { color: theme[item.value as TLDefaultColorStyle].solid }
								: undefined
						}
						onPointerEnter={handleButtonPointerEnter}
						onPointerDown={handleButtonPointerDown}
						onPointerUp={handleButtonPointerUp}
						onClick={handleButtonClick}
						icon={item.icon as TLUiIconType}
					/>
				)
			)}
		</div>
	)
}

export interface CustomButtonProps {
	item: any
}

/** @internal */
export const ButtonPicker = React.memo(_ButtonPicker) as typeof _ButtonPicker
