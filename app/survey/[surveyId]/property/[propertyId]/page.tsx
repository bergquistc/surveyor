import React, { Suspense } from "react"

import variables from "@/variables"
import PropertyMainDetails from "@/components/property/PropertyMainDetails"
import { numberWithCommas } from "@/utils/formatters"
import PropertyMap from "@/components/property/PropertyMap"

export default async function Page({ params }: { params: { propertyId: Promise<string> } }) {
	const propertyId = await params.propertyId
	const data = await fetch(`${variables.DOMAIN}/property?propertyId=${propertyId}`).then((response) =>
		response.json()
	)

	// Refs

	// State

	// Effects

	// Functions
	function renderLabelValueColumn(label: string, value: string) {
		return (
			<div className="flex flex-col items-center gap-2 p-2">
				<span className="text-cresa-midnight text-sm">{label}</span>
				<span className="text-cresa-goldenrod text-md">{value}</span>
			</div>
		)
	}
	function renderLabelValueRow(label: string, value: string) {
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
				<span className="text-cresa-goldenrod text-sm">{value !== undefined ? value : "-"}</span>
			</div>
		)
	}
	function renderTextColumn(label: string, value: string) {
		return (
			<div className="flex flex-col gap-2 p-2">
				<span className="text-cresa-goldenrod text-xs">{label}</span>
				<span className="text-cresa-light-gray text-sm">{value}</span>
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
							<PropertyMainDetails property={data} />
						</div>

						<div
							style={{
								backgroundImage: 'url("/homepage_picture.jpg")',
								backgroundSize: "cover",
								backgroundPosition: "center",
								width: "100%",
								height: "100%"
							}}
						/>
					</div>

					<div className="flex flex-col gap-12 p-10">
						{/* Spaces */}
						<div className="flex flex-col items-start gap-4">
							<h2 className="text-2xl text-cresa-midnight font-bold">Spaces</h2>

							<div className="flex gap-8">
								{renderLabelValueColumn("Rent/SF/YR", numberWithCommas(data["Rent/SF/Yr"]))}
								{renderLabelValueColumn("Star Rating", data["Star_Rating"])}
								{renderLabelValueColumn("Tenancy", data["Tenancy"])}
								{renderLabelValueColumn("Percent Leased", data["Percent_Leased"] + "%")}
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
								{renderLabelValueRow("Property Type", data["PropertyType"])}
								{renderLabelValueRow(
									"Building Size",
									numberWithCommas(data["Total_Available_Space_(SF)"]) + " SF"
								)}
								{renderLabelValueRow(
									"Typical Floor Size",
									numberWithCommas(data["Typical_Floor_Size"]) + " SF"
								)}
								{renderLabelValueRow("Building Class", data["Building_Class"])}
								{renderLabelValueRow("Building Status", data["Building_Status"])}
								{renderLabelValueRow("Owner", data["Owner"])}
								{renderLabelValueRow("Contact", data["Contact"])}
								{renderLabelValueRow("County", data["County_Name"])}
								{renderLabelValueRow("Parking", data["Parking_Ratio"])}
								{renderLabelValueRow("Built", data["Year_Built"])}
								{renderLabelValueRow("Total Floors", data["Number_Of_Stories"])}
								{renderLabelValueRow("Spaces", data["Spaces"])}
							</div>
						</div>

						{/* Building Amenities */}

						{/* Location */}
						<div className="flex flex-col items-start gap-2">
							<h2 className="text-2xl text-cresa-midnight font-bold">Location</h2>
							<p className="text-md text-cresa-goldenrod bg-cresa-midnight p-2 rounded-md">
								{data["Property_Address"]}, {data["City"]}, {data["State"]} {data["Zip"]}
							</p>

							<div className="flex w-full">
								<div className="w-1/2">
									<PropertyMap property={data} />
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
