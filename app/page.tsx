import React, { Suspense } from "react"

import SurveysHomepage from "@/components/surveys/SurveysHomepage"
import { TSurvey } from "@/types"
import { getSurveys } from "./actions/s3"

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60

export default async function Page() {
	// Refs

	// State

	// Effects

	// Functions

	// Components

	const surveys: TSurvey[] = await getSurveys()

	return (
		<React.Fragment>
			<Suspense fallback={<div>Loading...</div>}>
				<div className="h-screen overflow-none">
					<SurveysHomepage surveys={surveys} />
				</div>
			</Suspense>
		</React.Fragment>
	)
}
