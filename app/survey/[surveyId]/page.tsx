import React, { Suspense } from "react"

import Home from "@/components/Home"
import Properties from "@/components/Properties"
import variables from "@/variables"

export default async function Page({
	params,
	searchParams
}: {
	params: Promise<{ surveyId: string }>
	searchParams: Promise<{ date: string }>
}) {
	const { surveyId } = await params
	const { date } = await searchParams

	const surveyGetUrl = `${variables.DOMAIN}/survey?surveyId=${surveyId}&date=${date}`
	const propertiesGetUrl = `${variables.DOMAIN}/properties?surveyId=${surveyId}`

	const survey = await fetch(surveyGetUrl).then((response) => response.json())

	const properties = await fetch(propertiesGetUrl)
		.then((response) => response.json())
		.then((data) => {
			return data.properties
		})

	return (
		<React.Fragment>
			<Suspense fallback={<div>Loading...</div>}>
				<div className="flex">
					<Home survey={survey} />
					<Properties survey={survey} properties={properties} />
				</div>
			</Suspense>
		</React.Fragment>
	)
}
