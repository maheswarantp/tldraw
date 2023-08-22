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
import { useRef, useState } from 'react'
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
	isCustomColor?: boolean
	onPopUpValueChange?: () => void
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
		isCustomColor,
		onPopUpValueChange,
	} = props
	const editor = useEditor()
	const msg = useTranslation()

	const rPointing = useRef(false)

	const {
		handleButtonClick,
		handleButtonPointerDown,
		handleButtonPointerEnter,
		handleButtonPointerUp,
		handleCustomColorClick,
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

		const handleCustomColorClick = (e: React.PointerEvent<HTMLButtonElement>) => {
			// console.log(`Custom Color Button Clicked`);
			backgroundState === '' ? setBackgroundState('var(--color-hint)') : setBackgroundState('')
			onPopUpValueChange?.()
		}
		return {
			handleButtonClick,
			handleButtonPointerDown,
			handleButtonPointerEnter,
			handleButtonPointerUp,
			handleCustomColorClick,
		}
	}, [value, editor, onValueChange, style])

	const theme = useValue(
		'theme',
		() => getDefaultColorTheme({ isDarkMode: editor.user.isDarkMode }),
		[editor]
	)

	const [backgroundState, setBackgroundState] = useState('')

	return (
		<div
			className={classNames('tlui-button-grid', {
				'tlui-button-grid__two': columns === 2,
				'tlui-button-grid__three': columns === 3,
				'tlui-button-grid__four': columns === 4,
			})}
		>
			{items.map((item) =>
				item.value === 'custom-color' ? null : (
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
			{isCustomColor ? (
				<Button
					key={(items as any).find((item: any) => item.value === 'custom-color').value}
					icon={(items as any).find((item: any) => item.value === 'custom-color').icon}
					style={
						style === (DefaultColorStyle as StyleProp<unknown>)
							? {
									color: theme['custom-color'].solid,
									borderRadius: '10px',
									background: backgroundState,
							  }
							: undefined
					} // Red button for now, make it different later
					onClick={handleCustomColorClick}
					title={(items as any).find((item: any) => item.value === 'custom-color').value}
				/>
			) : null}
		</div>
	)
}

/** @internal */
export const ButtonPicker = React.memo(_ButtonPicker) as typeof _ButtonPicker
