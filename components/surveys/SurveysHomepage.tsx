"use client"

import React, { useState } from "react"
import CreateSurveyModal from "../utility/CreateSurveyModal"
import SurveyCard from "./SurveyCard"
import { TSurvey } from "@/types"
import { useRouter } from "next/navigation"

function SurveysHomepage({ surveys }: { surveys: TSurvey[] }) {
	const router = useRouter()
	// Refs

	// State
	const [isNewSurveyOpen, setIsNewSurveyOpen] = useState(false)

	// Effects

	// Functions

	// Components
	const header = (
		<React.Fragment>
			<div className="text-cresa-goldenrod p-8 border-b border-cresa-light-gray">
				<div className="flex justify-between gap-8">
					<h1 className="text-4xl">Surveys</h1>

					<div
						className="flex gap-2 bg-cresa-goldenrod text-cresa-midnight p-2 px-4 rounded-md cursor-pointer border-1 hover:border-cresa-light-gray"
						onClick={() => setIsNewSurveyOpen(true)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="size-6"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>

						<button className="cursor-pointer">New Survey</button>
					</div>
				</div>
			</div>
		</React.Fragment>
	)

	return (
		<React.Fragment>
			<div className="flex w-full bg-light-gray overflow-hidden h-full">
				<div
					className="flex-fill bg-midnight bg-center flex flex-col justify-content-start align-start overflow-auto pad bg-cover bg-center h-full w-full"
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						pointerEvents: "none",
						backgroundImage: `url("https://media.architecturaldigest.com/photos/6336fe8594fa771c2e9e6a37/4:3/w_5332,h_3999,c_limit/480A_SOIL_-_HUMANS_WORK_VA_04696.jpg")`,
						paddingTop: 0,
						zIndex: -1
					}}
				/>
				<div className="w-1/2 p-12 h-content">
					<div className="p-4 w-max">
						<img src={"/cresa.png"} alt="Cresa Logo" width={400} />
					</div>
				</div>

				<div className="flex flex-col h-full w-1/2 bg-cresa-midnight overflow-none">
					{header}
					<div className="h-full p-8 pb-0 overflow-y-auto">
						{surveys.map((survey: TSurvey, index: number) => (
							<React.Fragment key={index}>
								<SurveyCard survey={survey} />
							</React.Fragment>
						))}
					</div>
				</div>
			</div>

			{isNewSurveyOpen && (
				<CreateSurveyModal
					onSubmit={() => {
						router.refresh()
					}}
					onClose={() => setIsNewSurveyOpen(false)}
				/>
			)}
		</React.Fragment>
	)
}

export default SurveysHomepage
