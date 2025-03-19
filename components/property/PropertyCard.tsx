"use client"

import React from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { useCallback } from "react"
import { TProperty } from "@/types"

function PropertyCard({ property }: { property: TProperty }) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const params = useParams<{ surveyId: string; propertyId: string }>()
	// Refs

	// State

	// Effects

	// Functions

	const handlePropertyClick = useCallback(() => {
		router.push(`/survey/${params.surveyId}/property/${property?.propertyId}?${searchParams.toString()}`)
	}, [property?.propertyId, params, router, searchParams])

	// Components
	const renderStatistic = (label: string, value: string) => {
		return (
			<React.Fragment>
				<div className="flex flex-col">
					<div className="text-sm text-cresa-dark-gray">{label}</div>
					<div className="text-sm text-cresa-midnight">{value}</div>
				</div>
			</React.Fragment>
		)
	}

	return (
		<div className="w-full overflow-hidden px-8 my-4">
			<div className="pb-4 border-b border-cresa-goldenrod">
				{/* Top */}
				<div className="flex flex-col gap-2">
					<div className="flex gap-6 flex-grow">
						<div className="relative min-w-[200px]">
							{/* Picture */}
							<img
								src={"/office_1.jpg"}
								width={200}
								height={100}
								className="object-cover rounded-sm pointer-events-none"
							/>
						</div>

						{/* Details */}
						<div className="flex flex-col w-full">
							<div className="flex flex-col" onClick={handlePropertyClick}>
								<h2 className="text-md text-cresa-midnight font-bold cursor-pointer hover:underline">
									{property["Property_Name"]}
								</h2>
								<p className="text-xs text-cresa-dark-gray">
									{property["Property_Address"]}, {property["City"]}, {property["State"]}
								</p>
							</div>

							<div className="grid grid-cols-2 gap-1 mt-4 space-between">
								{renderStatistic("Submarket", property["Submarket_Name"])}
								{renderStatistic("Building Size", property["Total_Available_Space_(SF)"] + " sqft")}
								{renderStatistic("Built", property["Year_Built"].toString())}
								{renderStatistic("Rent", `${property["Rent/SF/Yr"]}/FS`)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PropertyCard
