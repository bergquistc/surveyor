"use client"

import { TProperty } from "@/types"
import variables from "@/variables"
import React, { ReactNode, useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

function EditPropertyModal({
	property,
	onSubmit,
	onClose
}: {
	property: TProperty
	onSubmit: (property: TProperty) => void
	onClose: () => void
}) {
	const router = useRouter()
	// Refs

	// State
	const [newProperty, setNewProperty] = useState(property)
	const [isPending, startTransition] = useTransition()
	const [isFetching, setIsFetching] = useState(false)

	const isMutating = isFetching || isPending

	// Effects
	const handleSubmit = useCallback(async () => {
		const updates = []
		for (const [key, value] of Object.entries(newProperty)) {
			// @ts-ignore
			if (property[key] !== value) {
				updates.push(
					fetch(`${variables.DOMAIN}/property`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ propertyId: property.propertyId, updateKey: key, updateValue: value })
					}).then((res) => res.json())
				)
			}
		}

		Promise.all(updates).then((responses) => {
			startTransition(() => {
				// Refresh the current route and fetch new data from the server without
				// losing client-side browser or React state.
				router.refresh()
			})
			onClose()
		})
	}, [property, newProperty, onSubmit])

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
		setNewProperty((prev) => ({
			...prev,
			[field]: value
		}))
	}

	const handleClose = () => {
		resetState()
		onClose()
	}
	const resetState = () => {
		setNewProperty(property)
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
	const propertyInformation = (
		<React.Fragment>
			<Grouping title={"Basic Information"}>
				{renderInputField("Property Name", true, newProperty?.Property_Name, (e) =>
					updatePropertyField("Property_Name", e.target.value)
				)}

				{renderInputField("Property Address", true, newProperty?.Property_Address, (e) =>
					updatePropertyField("Property_Address", e.target.value)
				)}

				{renderInputField("City", true, newProperty.City, (e) => updatePropertyField("City", e.target.value))}
				{renderInputField("State", true, newProperty.State, (e) =>
					updatePropertyField("State", e.target.value)
				)}
				{renderInputField("Zip", true, newProperty.Zip.toString(), (e) =>
					updatePropertyField("Zip", e.target.value)
				)}
				{renderInputField("Submarket Name", true, newProperty.Submarket_Name, (e) =>
					updatePropertyField("Submarket_Name", e.target.value)
				)}
			</Grouping>
		</React.Fragment>
	)
	const spacesDetails = (
		<React.Fragment>
			<Grouping title={"Spaces"}>
				{renderInputField("Rent / SF / YR", true, newProperty["Rent/SF/Yr"].toString(), (e) =>
					updatePropertyField("Rent/SF/Yr", e.target.value)
				)}
				{renderInputField("Star Rating", true, newProperty?.Star_Rating, (e) =>
					updatePropertyField("Star_Rating", e.target.value)
				)}

				{renderInputField("Tenancy", true, newProperty.Tenancy, (e) =>
					updatePropertyField("Tenancy", e.target.value)
				)}
				{renderInputField("Percent Leased", true, newProperty.Percent_Leased, (e) =>
					updatePropertyField("Percent_Leased", e.target.value)
				)}
			</Grouping>
		</React.Fragment>
	)
	const buildingDetails = (
		<React.Fragment>
			<Grouping title={"Building Details"}>
				{renderDropdown(
					"Property Type",
					true,
					newProperty?.PropertyType,
					(e) => updatePropertyField("PropertyType", e.target.value),
					["Office", "Industrial"]
				)}
				{renderInputField("Typical Floor Size", false, newProperty.Typical_Floor_Size, (e) =>
					updatePropertyField("Typical_Floor_Size", e.target.value)
				)}
				{renderInputField(
					"Total Available Space (SF)",
					false,
					newProperty["Total_Available_Space_(SF)"].toString(),
					(e) => updatePropertyField("Total_Available_Space_(SF)", e.target.value)
				)}
				{renderDropdown(
					"Building Status",
					true,
					newProperty?.Building_Status,
					(e) => updatePropertyField("Building_Status", e.target.value),
					["Existing", "Other"]
				)}
				{renderInputField("Contact", false, newProperty.Contact, (e) =>
					updatePropertyField("Contact", e.target.value)
				)}
				{renderInputField("Parking", false, newProperty.Parking, (e) =>
					updatePropertyField("Parking", e.target.value)
				)}
				{renderInputField("Total Floors", false, newProperty.Total_Floors, (e) =>
					updatePropertyField("Total_Floors", e.target.value)
				)}
				{renderInputField("Building Size", false, newProperty.Building_Size, (e) =>
					updatePropertyField("Building_Size", e.target.value)
				)}
				{renderInputField("Year Built", false, newProperty.Year_Built.toString(), (e) =>
					updatePropertyField("Year_Built", e.target.value)
				)}
				{renderInputField("Building Class", false, newProperty.Building_Class, (e) =>
					updatePropertyField("Building_Class", e.target.value)
				)}
				{renderInputField("Owner", false, newProperty.Owner, (e) =>
					updatePropertyField("Owner", e.target.value)
				)}
				{renderInputField("County", false, newProperty.County, (e) =>
					updatePropertyField("County", e.target.value)
				)}
				{renderInputField("Spaces", false, newProperty.Spaces, (e) =>
					updatePropertyField("Spaces", e.target.value)
				)}
				{renderInputField("Percent Leased", false, newProperty.Percent_Leased, (e) =>
					updatePropertyField("Percent_Leased", e.target.value)
				)}
				{renderInputField("Tenancy", false, newProperty.Tenancy, (e) =>
					updatePropertyField("Tenancy", e.target.value)
				)}
				{renderInputField("Star Rating", false, newProperty.Star_Rating, (e) =>
					updatePropertyField("Star_Rating", e.target.value)
				)}
				{renderInputField("Location Notes", false, newProperty.Location_Notes, (e) =>
					updatePropertyField("Location_Notes", e.target.value)
				)}
				{renderInputField("Building Detail Notes", false, newProperty.Building_Detail_Notes, (e) =>
					updatePropertyField("Building_Detail_Notes", e.target.value)
				)}
				{renderInputField("Spaces Notes", false, newProperty.Spaces_Notes, (e) =>
					updatePropertyField("Spaces_Notes", e.target.value)
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
							{propertyInformation}
							{spacesDetails}
							{buildingDetails}
						</div>
					</div>

					<div className={"flex justify-between p-2"}>
						<button
							onClick={handleClose}
							type="submit"
							className="bg-red-700 text-white p-1 cursor-pointer"
							disabled={isPending}
						>
							Close
						</button>
						<button
							onClick={handleSubmit}
							type="submit"
							className="bg-cresa-midnight text-white p-1 cursor-pointer"
							disabled={isPending}
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default EditPropertyModal

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
