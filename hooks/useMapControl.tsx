"use client"

import React, { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"

const lngLat: [number, number] = [-111.985981, 33.397052]
mapboxgl.accessToken =
	"pk.eyJ1IjoiY29ubm9yYmVyZ3F1aXN0IiwiYSI6ImNtODNqdjRvdzFxbHEybHB5dmtueWVlYXcifQ.r1ghr9tlg55rhsmbR_JHew"

function useMapControl({ container, initConfig }: { container: any; initConfig: object }) {
	// Refs
	const hasCreatedRef = useRef(false)

	// State
	const [map, setMap] = useState<mapboxgl.Map | null>(null)

	// Effects
	useEffect(() => {
		if (!container?.current || hasCreatedRef.current) {
			return
		}

		const map = new mapboxgl.Map({
			container: container?.current as HTMLElement,
			center: lngLat,
			zoom: 12,
			...initConfig
		})

		// mapRef.current = map

		map.on("style.load", () => {
			setMap(map)
		})

		hasCreatedRef.current = true

		return () => {
			setMap(null)
		}
	}, [container?.current])

	return map
}

export default useMapControl
