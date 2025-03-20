export type TSurvey = {
	surveyId: string
	surveyName: string
	surveyType: string
	city: string
	state: string
	creator: string
	client: string
	projectType: string
	templateType: string
	date: number
}

export type TProperty = {
	propertyId: string
	surveyId: string
	Property_Name: string
	Property_Address: string
	PropertyType: string
	City: string
	State: string
	Zip: number
	Submarket_Name: string
	"Total_Available_Space_(SF)": number
	Year_Built: number
	"Rent/SF/Yr": number
	Building_Class: string
	Typical_Floor_Size: string
	Building_Status: string
	Contact: string
	Parking: string
	Total_Floors: string
	Building_Size: string
	Owner: string
	County: string
	Spaces: string
	Percent_Leased: string
	Tenancy: string
	Star_Rating: string
	Location_Notes: string
	Building_Detail_Notes: string
	Spaces_Notes: string
	WKT: string | null
}
