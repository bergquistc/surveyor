import React, { Suspense } from "react"

import PropertyMainDetails from "@/components/property/PropertyMainDetails"
import { numberWithCommas } from "@/utils/formatters"
import PropertyMap from "@/components/property/PropertyMap"
import { getProperty } from "@/app/actions/s3"
import { TProperty, TSurvey } from "@/types"
import variables from "@/variables"

export default async function Page({ params }: { params: { surveyId: string; propertyId: string } }) {
	const param = await params

	const surveyId = param.surveyId
	const propertyId = param.propertyId

	const surveyGetUrl = `${variables.DOMAIN}/survey?surveyId=${surveyId}`
	const survey: TSurvey = await fetch(surveyGetUrl).then((response) => response.json())
	const property: TProperty = await getProperty(propertyId)

	// Refs

	// State

	// Effects

	// Functions
	function renderLabelValueColumn(label: string, value: string) {
		const valueCondition = value !== "" && (value !== null || value !== undefined)
		return (
			<div className="flex flex-col items-center gap-2 p-2">
				<span className="text-cresa-midnight text-sm">{label}</span>
				<span className="text-cresa-goldenrod text-md">{valueCondition ? value : "-"}</span>
			</div>
		)
	}
	function renderLabelValueRow(label: string, value: string) {
		const valueCondition = value !== "" && (value !== null || value !== undefined)
		return (
			<div
				className="border-b border-cresa-midnight"
				style={{
					display: "grid",
					gridTemplateColumns: "subgrid",
					gridTemplateRows: "subgrid",
					gridColumn: "span 2",
					padding: "0.25em 0"
				}}
			>
				<span className="text-cresa-midnight text-xs">{label}</span>
				<span className="text-cresa-goldenrod text-sm">{valueCondition ? value : "-"}</span>
			</div>
		)
	}
	function renderTextColumn(label: string, value: string) {
		const valueCondition = value !== "" && (value !== null || value !== undefined)
		return (
			<div className="flex flex-col gap-2 p-2">
				<span className="text-cresa-goldenrod text-xs">{label}</span>
				<span className="text-cresa-light-gray text-sm">{valueCondition ? value : "-"}</span>
			</div>
		)
	}

	// Components

	return (
		<React.Fragment>
			<Suspense fallback={<div>Loading...</div>}>
				{/* Main Wrapper */}
				<div className="flex flex-col w-full">
					{/* Details and Image Carousel */}
					<div className="flex w-full min-h-100 h-100 justify-center">
						<div className="flex justify-center items-center w-full h-100 bg-cresa-midnight">
							<PropertyMainDetails survey={survey} property={property} />
						</div>

						{property.s3PresignedUrl ? (
							<div
								style={{
									backgroundImage: `url(${property.s3PresignedUrl})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
									width: "100%",
									height: "100%"
								}}
							/>
						) : (
							<div
								style={{
									backgroundImage: `/branding/cover_image.jpg`,
									backgroundSize: "cover",
									backgroundPosition: "center",
									width: "100%",
									height: "100%"
								}}
							/>
						)}
					</div>

					<div className="flex flex-col gap-12 p-10">
						{/* Spaces */}
						<div className="flex flex-col items-start gap-4">
							<h2 className="text-2xl text-cresa-midnight font-bold">Spaces</h2>

							<div className="flex gap-8">
								{renderLabelValueColumn("Rent/SF/YR", numberWithCommas(property["Rent/SF/Yr"]))}
								{renderLabelValueColumn("Star Rating", property["Star_Rating"])}
								{renderLabelValueColumn("Tenancy", property["Tenancy"])}
								{renderLabelValueColumn("Percent Leased", property["Percent_Leased"] + "%")}
							</div>
						</div>

						<div className="w-full h-1 bg-cresa-light-gray" />

						{/* Builidng Details */}
						<div className="flex flex-col items-start gap-4">
							<h2 className="text-2xl text-cresa-midnight font-bold">Building Details</h2>

							<div
								style={{
									display: "inline-grid",
									gridTemplateColumns: "repeat(2, max-content auto)",
									columnGap: "2em"
								}}
							>
								{renderLabelValueRow("Property Type", property["PropertyType"])}
								{renderLabelValueRow(
									"Building Size",
									numberWithCommas(property["Total_Available_Space_(SF)"]) + " SF"
								)}
								{renderLabelValueRow(
									"Typical Floor Size",
									numberWithCommas(property["Typical_Floor_Size"]) + " SF"
								)}
								{renderLabelValueRow("Building Class", property["Building_Class"])}
								{renderLabelValueRow("Building Status", property["Building_Status"])}
								{renderLabelValueRow("Owner", property["Owner"])}
								{renderLabelValueRow("Contact", property["Contact"])}
								{renderLabelValueRow("County", property["County"])}
								{renderLabelValueRow("Parking", property["Parking"])}
								{renderLabelValueRow("Built", property["Year_Built"].toString())}
								{renderLabelValueRow("Total Floors", property["Total_Floors"])}
								{renderLabelValueRow("Spaces", property["Spaces"])}
							</div>
						</div>

						{/* Building Amenities */}

						{/* Location */}
						<div className="flex flex-col items-start gap-2">
							<h2 className="text-2xl text-cresa-midnight font-bold">Location</h2>
							<p className="text-md text-cresa-goldenrod bg-cresa-midnight p-2 rounded-md">
								{property["Property_Address"]}, {property["City"]}, {property["State"]}{" "}
								{property["Zip"]}
							</p>

							<div className="flex w-full">
								<div className="w-1/2">
									<PropertyMap property={property} />
								</div>

								<div className="flex flex-col  w-1/2 bg-cresa-midnight p-4">
									{renderTextColumn(
										"Parking Details",
										"244 Covered Spaces @ $150.00/month; Ratio of 1.00/1,000 SF"
									)}
									{renderTextColumn(
										"Transit Details",
										`Whiting Street Station (#11) 4 min walk, Dick Greco Plaza Station (#10) 10
											min walk, Hsbc Station (#9) 13 min walk, Amalie Arena Station (#8) 16 min
											walk, Cumberland Avenue Station (#7) 19 min walk`
									)}
									{renderTextColumn(
										"Airport Details",
										`	Tampa International 14 min drive, St Pete-Clearwater International 32 min
											drive`
									)}
									{renderTextColumn("Walk Score", `Walker’s Paradise (91)`)}
									{renderTextColumn("Transit Score", `Good Transit (60)`)}
								</div>
							</div>
						</div>
						{/* Key Tenants */}
					</div>
				</div>
			</Suspense>
		</React.Fragment>
	)
}
