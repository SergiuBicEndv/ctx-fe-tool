import {AcmeButton} from '@adi-ctx/acme-core-components-react';
import {MouseEventHandler} from 'react';
import styles from './ctx-button.module.css';

type CtxButtonProps = {
	isDisabled: boolean;
	isFullWidth: boolean;
	children: React.ReactNode;
	handleClick: MouseEventHandler<HTMLAcmeButtonElement>;
};

const CtxButton = ({
	children,
	isDisabled,
	isFullWidth,
	handleClick,
}: CtxButtonProps) => (
	<div className={styles.container}>
		<div className={styles.buttonWrapper}>
			<AcmeButton
				isDisabled={isDisabled}
				isFullWidth={isFullWidth}
				onClick={handleClick}
			>
				{children}
			</AcmeButton>
		</div>
	</div>
);

export default CtxButton;
