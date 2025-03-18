import React, { Suspense } from "react"

import variables from "@/variables"
import SurveysHomepage from "@/components/surveys/SurveysHomepage"

export default async function Page() {
	// Refs

	// State

	// Effects

	// Functions

	// Components

	const surveys = await fetch(`${variables.DOMAIN}/surveys`)
		.then((response) => response.json())
		.then((data) => {
			return data.Items
		})

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
