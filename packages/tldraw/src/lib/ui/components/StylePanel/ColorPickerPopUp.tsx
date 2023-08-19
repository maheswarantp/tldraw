// ColorPickerStyleMap
const colorPickerStyles = {
	div: {
		display: 'flex',
		justifyContent: 'center',
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

export const ColorPickerPopUp = ({
	handleColorPickerButtonClick,
	handleHexChoose,
}: ColorPickerProps) => {
	return (
		<div className="" style={colorPickerStyles.div}>
			<input
				type="text"
				style={colorPickerStyles.input}
				placeholder={'# HEX VALUE'}
				onKeyDown={handleHexChoose}
			/>
			{/* <Button icon='tool-colopicker' key={'colorpicker-button'} label={"HI"}/> */}
			<button style={colorPickerStyles.button} onClick={handleColorPickerButtonClick}>
				CLR
			</button>
		</div>
	)
}
