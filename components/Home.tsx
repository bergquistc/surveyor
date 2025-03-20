"use client"

import { TSurvey } from "@/types"
import variables from "@/variables"
import { useRouter } from "next/navigation"
import React, { useCallback } from "react"

export default function Home({ survey }: { survey: TSurvey }) {
	const router = useRouter()

	// Effects
	const handleBack = useCallback(() => {
		router.push(`/`)
	}, [router])
	const handleDeleteSurvey = useCallback(async () => {
		const response = await fetch(`${variables.DOMAIN}/survey`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				surveyId: survey.surveyId,
				date: survey.date
			})
		})

		if (response.ok && response.status === 200) {
			handleBack()
		}
	}, [survey])

	// Components

	const title = (
		<React.Fragment>
			<div className="flex flex-col gap-6 absolute top-1/8 left-4">
				<div className={" bg-cresa-goldenrod rounded-sm p-6"}>
					<h1 className={"px-6 text-4xl text-white"}>{survey.surveyName}</h1>
					<h3 className={"px-6 text-2xl text-midnight"}>
						{survey.surveyType} - {survey.city}, {survey.state}
					</h3>
				</div>
				<div className={" bg-cresa-midnight rounded-sm p-6"}>
					<h1 className={"px-6 text-4xl text-white"}>{survey.client}</h1>
					<h1 className={"px-6 text-2xl text-cresa-goldenrod"}>
						{survey.templateType} - {survey.projectType}
					</h1>
				</div>
			</div>
		</React.Fragment>
	)
	const backButton = (
		<React.Fragment>
			{/* Back Button */}
			<div className="absolute top-12 left-4">
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
	const deleteSurveyButton = (
		<React.Fragment>
			{/* Back Button */}
			<div className="absolute top-12 right-4">
				<button onClick={handleDeleteSurvey} className="flex items-center gap-2 p-2 bg-red-600 cursor-pointer">
					Delete Survey
				</button>
			</div>
		</React.Fragment>
	)

	return (
		<React.Fragment>
			<div className="relative flex w-full">
				{title}
				{backButton}
				{deleteSurveyButton}

				<div
					className="w-screen h-screen -z-1 absolute bg-cover bg-center"
					style={{
						pointerEvents: "none",
						backgroundImage: `url("/branding/survey_stock_image.jpg")`
					}}
				/>
			</div>
		</React.Fragment>
	)
}
