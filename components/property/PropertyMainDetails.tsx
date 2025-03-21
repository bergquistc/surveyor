"use client"

import React, { useState, useCallback } from "react"
import { numberWithCommas } from "@/utils/formatters"
import { useRouter } from "next/navigation"
import { TProperty, TSurvey } from "@/types"
import { createImage, deletePropertyImage } from "@/app/actions/s3"
import EditPropertyModal from "../utility/EditPropertyModal"
import variables from "@/variables"

export default function PropertyMainDetails({ survey, property }: { survey: TSurvey; property: TProperty }) {
	const router = useRouter()

	// State
	const [isEditPropertyModalOpen, setIsEditPropertyModalOpen] = useState(false)
	const renderStatistic = (label: string, value: string) => {
		return (
			<React.Fragment>
				<div className="flex flex-col">
					<div className="text-sm text-cresa-light-gray">{label}</div>
					<div className="text-lg text-cresa-goldenrod">{value}</div>
				</div>
			</React.Fragment>
		)
	}

	const handleDeleteProperty = useCallback(async () => {
		if (!property) {
			return
		}

		deletePropertyImage(property?.propertyId)
		const response = await fetch(`${variables.DOMAIN}/property`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				propertyId: property?.propertyId
			})
		})

		if (response.ok) {
			handleBack()
		}
	}, [property])

	const handleBack = useCallback(() => {
		router.push(`/survey/${survey.surveyId}`)
	}, [survey, router])

	interface FileSelectedEvent extends React.ChangeEvent<HTMLInputElement> {}

	const fileSelected = async (event: FileSelectedEvent) => {
		const file = event.target.files?.[0]
		if (!file || !property) {
			return
		}

		await createImage(file, property.propertyId)

		router.refresh()
	}

	const backButton = (
		<React.Fragment>
			{/* Back Button */}
			<div className="absolute top-12 left-12">
				<button
					onClick={handleBack}
					className="flex items-center gap-2 p-2 bg-cresa-goldenrod cursor-pointer hover:bg-cresa-orange transition-colors duration-300"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="size-4"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
						/>
					</svg>
					Back
				</button>
			</div>
		</React.Fragment>
	)
	const deletePropertyButton = (
		<React.Fragment>
			{/* Edit Property Button */}
			<div className="">
				<button
					className="flex items-center gap-2 p-2 text-sm text-white/90 bg-red-600 cursor-pointer"
					onClick={handleDeleteProperty}
				>
					Delete Property
				</button>
			</div>
		</React.Fragment>
	)
	const editPropertyButton = (
		<React.Fragment>
			{/* Edit Property Button */}
			<div className="">
				<button
					className="flex items-center gap-2 p-2 text-sm bg-cresa-goldenrod cursor-pointer"
					onClick={() => setIsEditPropertyModalOpen(true)}
				>
					Edit Property
				</button>

				{isEditPropertyModalOpen && (
					<EditPropertyModal
						property={property}
						onClose={() => setIsEditPropertyModalOpen(false)}
						onSubmit={() => {}}
					/>
				)}
			</div>
		</React.Fragment>
	)
	const editPropertyImageButton = (
		<React.Fragment>
			{/* Edit Property Button */}
			<div className="flex items-center gap-2 p-2 text-sm bg-cresa-goldenrod cursor-pointer">
				<label htmlFor={"file-upload"} className="cursor-pointer">
					Change Image
				</label>
				<input
					id={"file-upload"}
					onChange={fileSelected}
					type="file"
					accept="image/*"
					style={{ display: "none" }}
				/>
			</div>
		</React.Fragment>
	)

	return (
		<React.Fragment>
			{backButton}

			<div className="absolute flex items-center gap-4 top-6 right-6">
				{editPropertyButton}
				{editPropertyImageButton}
				{deletePropertyButton}
			</div>

			<div className="flex flex-col items-center justify-center w-full gap-8">
				<div className="flex flex-col">
					<h2 className="text-2xl text-cresa-goldenrod font-bold">{property["Property_Name"]}</h2>
					<p className="text-sm text-cresa-light-gray">
						{property["Property_Address"]}, {property["City"]}, {property["State"]} {property["Zip"]}
					</p>
				</div>

				<div className="flex gap-8 mt-4 space-between">
					{renderStatistic("Submarket", property["Submarket_Name"])}
					{renderStatistic(
						"Building Size",
						numberWithCommas(property["Total_Available_Space_(SF)"]) + " sqft"
					)}
					{renderStatistic("Built", property["Year_Built"].toString())}
					{renderStatistic("Building Class", property["Building_Class"])}
				</div>
			</div>
		</React.Fragment>
	)
}
