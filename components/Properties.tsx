"use client"
import React, { SyntheticEvent, useCallback, useState } from "react"
import PropertyCard from "./property/PropertyCard"
import * as xlsx from "xlsx"
import variables from "@/variables"
import { v4 as uuidv4 } from "uuid"
import { TProperty, TSurvey } from "@/types"

/* eslint-disable-next-line */
export default function Properties({ survey, properties }: { survey: TSurvey; properties: TProperty[] }) {
	// State
	const [propertiesList, setPropertiesList] = useState<TProperty[]>(properties)
	const [uploadedData, setUploadedData] = useState<unknown[]>([])

	interface FileUploadEvent extends SyntheticEvent {
		target: HTMLInputElement & EventTarget
	}

	const handleFileUpload = async (event: FileUploadEvent) => {
		const file = event.target.files?.[0]
		if (!file) return

		const fileReader = new FileReader()

		fileReader.onload = async (e: ProgressEvent<FileReader>) => {
			if (!e.target || !e.target.result) return
			const bufferArray = new Uint8Array(e.target.result as ArrayBuffer)

			const arr: string[] = []
			for (let i = 0; i < bufferArray.length; ++i) arr[i] = String.fromCharCode(bufferArray[i])
			const data = arr.join("")

			// using xlsx library convert file to json
			const workbook = xlsx.read(data, { type: "binary" })
			const sheetName = workbook.SheetNames[0]
			const worksheet = workbook.Sheets[sheetName]
			const json = xlsx.utils.sheet_to_json(worksheet)

			setUploadedData(json)
		}
		fileReader.readAsArrayBuffer(file)
	}

	const createProperties = useCallback(async () => {
		const _normalizedProperties = uploadedData.map((property) => {
			const normalizedProperty: TProperty = {
				propertyId: uuidv4(),
				surveyId: survey.surveyId,
				Property_Name: "",
				Property_Address: "",
				City: "",
				State: "",
				Submarket_Name: "",
				"Total_Available_Space_(SF)": 0,
				Year_Built: 0,
				"Rent/SF/Yr": 0,
				PropertyType: "",
				Zip: 0,
				Building_Class: "",
				Typical_Floor_Size: "",
				Building_Status: "",
				Contact: "",
				Parking: "",
				Total_Floors: "",
				Building_Size: "",
				Owner: "",
				County: "",
				Spaces: "",
				Percent_Leased: "",
				Tenancy: "",
				Star_Rating: "",
				Location_Notes: "",
				Building_Detail_Notes: "",
				Spaces_Notes: ""
			}
			const keys = Object.keys(property as object)
			for (const key of keys) {
				const normalizedKey = key.replace(/ /g, "_")
				/* eslint-disable-next-line */
				normalizedProperty[normalizedKey] = (property as { [key: string]: any })[key]
			}

			return normalizedProperty
		})

		const responses = await Promise.all(
			_normalizedProperties.map((property) =>
				fetch(variables.DOMAIN + "/property", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(property)
				})
					.then((response) => response.json())
					.catch((e) => {
						console.error("Bad Creation", e)
					})
			)
		)

		const createdProperties: TProperty[] = []
		for (const node of responses) {
			if (!node || !node.Item) {
				continue
			}
			createdProperties.push(node.Item)
		}

		setPropertiesList((prev) => [...createdProperties, ...prev])
		setUploadedData([])
	}, [survey?.surveyId, uploadedData])

	// Components
	const header = (
		<React.Fragment>
			<div className="text-cresa-midnight p-4 px-8 pb-0 border-b border-cresa-dark-gray">
				<div className="flex justify-between gap-8 pb-4">
					<h1 className="text-4xl">Properties</h1>

					<div className="flex gap-2 bg-cresa-midnight text-cresa-midnight p-2 px-4 rounded-md cursor-pointer border-1 hover:border-cresa-light-gray">
						<input
							className="text-cresa-light-gray cursor-pointer"
							type={"file"}
							onChange={handleFileUpload}
							accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
						/>
					</div>
				</div>
			</div>
		</React.Fragment>
	)

	return (
		<React.Fragment>
			<div className="flex flex-col bg-cresa-light-gray w-full h-screen overflow-hidden">
				{header}

				<div className="overflow-y-auto">
					{propertiesList.map((property: TProperty, index: number) => {
						return (
							<React.Fragment key={index}>
								<PropertyCard property={property} />
							</React.Fragment>
						)
					})}
				</div>
			</div>

			{uploadedData.length > 0 && (
				<React.Fragment>
					<div className="fixed inset-0 bg-black/50 ">
						<div className="flex items-center justify-center h-full">
							<div className="w-[80%] h-[80%] bg-cresa-midnight rounded-lg  overflow-hidden">
								<div className="flex flex-col p-4 h-full overflow-hidden">
									<h2 className="text-4xl p-4 text-cresa-goldenrod">Uploaded Data</h2>

									<div className="overflow-y-auto">
										<table className="bg-cresa-light-gray">
											<thead>
												<tr>
													{Object.keys(uploadedData[0] as object).map((key) => (
														<th
															key={key}
															className="text-sm min-w-50 p-2 text-cresa-midnight text-left border-r border-b"
														>
															{key}
														</th>
													))}
												</tr>
											</thead>
											<tbody className="bg-white">
												{uploadedData.map((row, rowIndex) => (
													<tr key={rowIndex}>
														{/*  eslint-disable-next-line  */}
														{Object.values(row as { [key: string]: any }).map(
															(value, colIndex) => (
																<td
																	key={colIndex}
																	className="text-sm min-w-50 p-2 text-cresa-midnight border-r border-b"
																>
																	{value as React.ReactNode}
																</td>
															)
														)}
													</tr>
												))}
											</tbody>
										</table>
									</div>

									<div className={"flex justify-between mt-4"}>
										<button
											onClick={() => setUploadedData([])}
											className=" bg-red-500 text-white py-2 px-4 rounded"
										>
											Close
										</button>
										<button
											onClick={createProperties}
											className="bg-green-500 text-white py-2 px-4 rounded"
										>
											Accept
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</React.Fragment>
			)}
		</React.Fragment>
	)
}
