import {AcmeInput} from '@adi-ctx/acme-core-components-react';
import styles from './ctx-input.module.css';

type CtxInputProps = {
	label: string;
	value?: string;
	fieldtype: string;
	error?: string;
	errorType?: 'warning' | 'error';
	disabled?: boolean;
	onChange?: (e: any) => void;
};

const CtxInput = ({
	value = ' ',
	label,
	fieldtype,
	error,
	errorType,
	disabled,
	onChange,
}: CtxInputProps) => (
	<div className={styles.container}>
		<div className={styles.inputWrapper}>
			<AcmeInput
				className={styles.input}
				full-width
				id={label}
				fieldType={fieldtype}
				label={label}
				value={value}
				issueText={error}
				issueType={errorType}
				isDisabled={disabled}
				onChanged={event => onChange?.(event.detail)}
			/>
		</div>
	</div>
);

export default CtxInput;
