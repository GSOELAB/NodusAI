import type { InputHTMLAttributes } from 'react';
import styles from './ProjectPages.module.css';

type SharedProps = Pick<
	InputHTMLAttributes<HTMLInputElement>,
	'autoComplete' | 'autoFocus' | 'maxLength' | 'placeholder' | 'required' | 'type'
> & {
	value: string;
	onChange: (value: string) => void;
};

type ProjectInputProps = SharedProps &
	(
		| {
				variant: 'inline';
				ariaLabel: string;
				label?: never;
				hint?: never;
				multiline?: never;
		  }
		| {
				variant?: 'field';
				label: string;
				ariaLabel?: never;
				hint?: string;
				multiline?: boolean;
				rows?: number;
		  }
	);

export function ProjectInput(props: ProjectInputProps) {
	if (props.variant === 'inline') {
		return (
			<input
				aria-label={props.ariaLabel}
				className={styles.subjectInput}
				maxLength={props.maxLength}
				placeholder={props.placeholder}
				value={props.value}
				onChange={(event) => props.onChange(event.target.value)}
			/>
		);
	}

	return (
		<label className={styles.field}>
			<span>{props.label}</span>
			{props.multiline ? (
				<textarea
					maxLength={props.maxLength}
					required={props.required}
					rows={props.rows}
					value={props.value}
					onChange={(event) => props.onChange(event.target.value)}
				/>
			) : (
				<input
					autoComplete={props.autoComplete}
					autoFocus={props.autoFocus}
					maxLength={props.maxLength}
					placeholder={props.placeholder}
					required={props.required}
					type={props.type}
					value={props.value}
					onChange={(event) => props.onChange(event.target.value)}
				/>
			)}
			{props.hint && <span className={styles.helpText}>{props.hint}</span>}
		</label>
	);
}
