"use client"

import React, { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"

const lngLat: [number, number] = [-111.985981, 33.397052]
function PropertyMap() {
	// Refs
	const mapRef = useRef<mapboxgl.Map | null>(null)
	const mapContainerRef = useRef<HTMLDivElement | null>(null)
	// State

	// Effects
	useEffect(() => {
		mapboxgl.accessToken =
			"pk.eyJ1IjoiY29ubm9yYmVyZ3F1aXN0IiwiYSI6ImNtODNqdjRvdzFxbHEybHB5dmtueWVlYXcifQ.r1ghr9tlg55rhsmbR_JHew"
		const map = (mapRef.current = new mapboxgl.Map({
			container: mapContainerRef.current as HTMLElement,
			center: lngLat,
			zoom: 12
		}))

		map.on("style.load", () => {
			map.addSource("propertyPoint", {
				type: "geojson",
				data: {
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: lngLat
					},
					properties: {
						title: "Mapbox DC",
						"marker-symbol": "default_marker"
					}
				}
			})

			map.addLayer({
				id: "propertyPointLayer",
				source: "propertyPoint",
				type: "circle",
				paint: {
					"circle-radius": 10,
					"circle-color": "#ffb600",
					"circle-stroke-width": 2,
					"circle-stroke-color": "#ffffff"
				}
			})

			// add markers to map

			new mapboxgl.Marker().setLngLat(lngLat).addTo(map) // Replace this line with code from step 7-2
		})

		return () => {
			if (mapRef.current) {
				mapRef.current.remove()
			}
		}
	}, [])

	// Functions

	// Components

	return (
		<React.Fragment>
			<div ref={mapContainerRef} id="map-container" style={{ width: "100%" }} />
		</React.Fragment>
	)
}

export default PropertyMap
