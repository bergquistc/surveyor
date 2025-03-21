import React, { Suspense } from "react"

import Home from "@/components/Home"
import Properties from "@/components/Properties"
import variables from "@/variables"
import { getProperties } from "@/app/actions/s3"

export default async function Page({ params }: { params: Promise<{ surveyId: string }> }) {
	const { surveyId } = await params

	const surveyGetUrl = `${variables.DOMAIN}/survey?surveyId=${surveyId}`

	const survey = await fetch(surveyGetUrl).then((response) => response.json())
	const properties = await getProperties(surveyId)

	if (!survey) {
		return <div>Survey not found</div>
	}

	return (
		<React.Fragment>
			<Suspense fallback={<div>Loading...</div>}>
				<div className="flex">
					<Home survey={survey} properties={properties} />
					<Properties survey={survey} properties={properties} />
				</div>
			</Suspense>
		</React.Fragment>
	)
}
