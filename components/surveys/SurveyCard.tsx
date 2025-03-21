"use client"

import { TSurvey } from "@/types"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

function SurveyCard({ survey }: { survey: TSurvey }) {
	const router = useRouter()
	const searchParams = useSearchParams()

	// Refs

	// State

	// Effects
	const handleSurveyClick = useCallback(() => {
		router.push(`/survey/${survey.surveyId}`)
	}, [survey.surveyId])

	// Functions

	// Components
	const renderStatistic = (label: string, value: string) => {
		return (
			<React.Fragment>
				<div className="flex flex-col">
					<div className="text-sm text-cresa-light-gray/80">{label}</div>
					<div className="text-sm text-cresa-goldenrod">{value}</div>
				</div>
			</React.Fragment>
		)
	}

	return (
		<React.Fragment>
			<div className="w-full overflow-hidden px-8 my-6 ">
				<div className="pb-4 border-b border-cresa-goldenrod">
					{/* Top */}
					<div className="flex flex-col gap-2">
						<div className="flex gap-6 flex-grow">
							<div className="relative cursor-pointer" onClick={handleSurveyClick}>
								{/* Picture */}
								<img
									src={"/branding/cover_image.png"}
									width={300}
									className="object-cover rounded-sm pointer-events-none"
								/>
							</div>

							{/* Details */}
							<div className="flex flex-col w-full">
								<div className="flex flex-col text-cresa-goldenrod" onClick={handleSurveyClick}>
									<h2 className="text-md  font-bold cursor-pointer hover:underline">
										{survey["surveyName"]} - {survey["client"]}
									</h2>
									<h2 className="text-md text-cresa-light-gray font-bold cursor-pointer">
										{survey["surveyType"]} - {survey["city"]}, {survey["state"]}
									</h2>
								</div>

								<div className="grid grid-cols-2 gap-1 mt-4 space-between">
									{renderStatistic("Survey Owner", survey["creator"])}
									{renderStatistic("Project Type", survey["projectType"])}
									{renderStatistic("Template Type", survey["templateType"])}
									{renderStatistic("Date Created", new Date(survey["date"]).toLocaleString())}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default SurveyCard
