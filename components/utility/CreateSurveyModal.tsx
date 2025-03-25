"use client"

import { TSurvey } from "@/types"
import React, { ReactNode, useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createSurvey } from "@/app/actions/s3"

const initialSurvey = {
	surveyName: "",
	surveyType: "",
	state: "",
	city: "",
	creator: "Connor Bergquist",
	client: "",
	projectType: "",
	templateType: ""
}

function CreateSurveyModal({ onSubmit, onClose }: { onSubmit: (survey: TSurvey) => void; onClose: () => void }) {
	const router = useRouter()
	// Refs

	// State
	const [newSurvey, setNewSurvey] = useState(initialSurvey)
	const [isFetching, setIsFetching] = useState(false)

	// Effects
	const canSubmit = useMemo(() => {
		return (
			newSurvey.surveyName.length &&
			newSurvey.surveyType.length &&
			newSurvey.projectType.length &&
			newSurvey.templateType.length
		)
	}, [newSurvey])

	const handleSubmit = useCallback(async () => {
		if (!canSubmit) {
			return
		}
		setIsFetching(true)

		const _survey = await createSurvey(newSurvey)

		if (_survey) {
			setIsFetching(false)
			onSubmit(_survey)
			onClose()
		}
	}, [newSurvey, canSubmit, onSubmit, router])

	// Functions
	const renderInputField = (
		label: string,
		required: boolean,
		value: string,
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	) => (
		<div
			className="text-xs text-cresa-goldenrod items-center"
			style={{
				display: "grid",
				gridTemplateColumns: "subgrid",
				gridTemplateRows: "subgrid",
				gridColumn: "span 2",
				padding: "0.1em 0"
			}}
		>
			<span>{label}</span>
			<input
				type={"text"}
				required={required}
				value={value}
				onChange={onChange}
				className="text-cresa-light-gray text-sm border-b p-1 w-full focus:outline-none"
			/>
		</div>
	)

	const renderDropdown = (
		label: string,
		required: boolean,
		value: string,
		onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
		options: string[]
	) => (
		<div
			className="text-xs text-cresa-goldenrod items-center"
			style={{
				display: "grid",
				gridTemplateColumns: "subgrid",
				gridTemplateRows: "subgrid",
				gridColumn: "span 2",
				padding: "0.1em 0"
			}}
		>
			<span>{label}</span>
			<select
				required={required}
				value={value}
				onChange={onChange}
				className="text-cresa-light-gray text-sm border-b p-1 w-full focus:outline-none"
			>
				<option disabled defaultChecked value="">
					-- select an option --
				</option>
				{options.map((option) => (
					<option key={option} value={option} className="text-cresa-midnight">
						{option}
					</option>
				))}
			</select>
		</div>
	)
	const updatePropertyField = (field: string, value: string) => {
		setNewSurvey((prev) => ({
			...prev,
			[field]: value
		}))
	}

	const handleClose = () => {
		resetState()
		onClose()
	}
	const resetState = () => {
		setNewSurvey(initialSurvey)
	}

	// Components
	const header = (
		<React.Fragment>
			<div className="p-2 flex justify-between items-center">
				<h2 className="text-xl text-cresa-midnight">Edit Property Fields</h2>
				<button onClick={handleClose} className="text-md text-cresa-midnight cursor-pointer">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="size-6"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</React.Fragment>
	)
	const surveyInformation = (
		<React.Fragment>
			<Grouping title={"Basic Information"}>
				{renderInputField("Survey Name", true, newSurvey?.surveyName, (e) =>
					updatePropertyField("surveyName", e.target.value)
				)}

				{renderInputField("Client", true, newSurvey?.client, (e) =>
					updatePropertyField("client", e.target.value)
				)}
				{renderInputField("City", true, newSurvey?.city, (e) => updatePropertyField("city", e.target.value))}
				{renderInputField("State", true, newSurvey?.state, (e) => updatePropertyField("state", e.target.value))}
			</Grouping>
		</React.Fragment>
	)
	const surveyType = (
		<React.Fragment>
			<Grouping title={"Basic Information"}>
				{renderDropdown(
					"Survey Type",
					true,
					newSurvey?.surveyType,
					(e) => updatePropertyField("surveyType", e.target.value),
					["Markey Survey", "Market Tour"]
				)}
				{renderDropdown(
					"Project Type",
					true,
					newSurvey?.projectType,
					(e) => updatePropertyField("projectType", e.target.value),
					["Relocation", "New Location", "Build to Suit"]
				)}
				{renderDropdown(
					"Template Type",
					true,
					newSurvey?.templateType,
					(e) => updatePropertyField("templateType", e.target.value),
					["Office", "Industrial"]
				)}
			</Grouping>
		</React.Fragment>
	)

	return (
		<React.Fragment>
			<div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
				<div className="bg-white rounded-lg shadow-lg w-1/2 p-3 ">
					{header}
					<div className="max-h-100 p-2 max-h-[400px] overflow-y-auto overflow-x-hidden">
						<div className="relative flex flex-col space-y-2 w-full">
							{surveyInformation}
							{surveyType}
						</div>
					</div>

					<div className={"flex justify-between p-2"}>
						<button
							onClick={handleClose}
							type="submit"
							className="bg-red-700 text-white p-1 cursor-pointer"
							disabled={isFetching}
						>
							Close
						</button>
						<button
							onClick={handleSubmit}
							type="submit"
							className="bg-cresa-midnight text-white p-1 cursor-pointer"
							disabled={!canSubmit || isFetching}
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default CreateSurveyModal

function Grouping({ title, children }: { title: string; children: ReactNode }) {
	return (
		<div className={"bg-cresa-midnight text-cresa-goldenrod rounded-sm"}>
			<div className={"flex flex-col p-4 gap-2"}>
				<h3 className="text-cresa-light-gray text-md">{title}</h3>

				<div
					style={{
						display: "inline-grid"
						// gridTemplateColumns: "repeat(2, 50%)",
						// columnGap: "1em"
					}}
				>
					{children}
				</div>
			</div>
		</div>
	)
}
