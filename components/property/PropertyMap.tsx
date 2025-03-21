"use client"

import useMapControl from "@/hooks/useMapControl"
import React, { useCallback, useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import { stringify, parse } from "wkt"
import { TProperty } from "@/types"
import variables from "@/variables"

function PropertyMap({ property }: { property: TProperty }) {
	let coords: [number, number] = [-98.5795, 39.8283]
	let zoom: number = 3

	if (property?.WKT) {
		const geojson = parse(property.WKT)
		if (geojson?.coordinates.length === 2) {
			coords = geojson.coordinates as [number, number]
		}
		zoom = 13
	}

	// Refs
	const mapContainerRef = useRef<HTMLDivElement | null>(null)

	// State
	const map = useMapControl({ container: mapContainerRef, initConfig: { center: coords, zoom: zoom } })

	// Effects
	const handleDraw = useCallback(
		(draw: MapboxDraw, marker: mapboxgl.Marker) => {
			const data = draw.getAll()

			if (data.features.length > 0) {
				const point = data.features[0]
				const coords = point.geometry.coordinates

				if (map) {
					marker.setLngLat(coords).addTo(map)
				}

				const wkt = stringify(point.geometry)
				fetch(`${variables.DOMAIN}/property`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ propertyId: property.propertyId, updateKey: "WKT", updateValue: wkt })
				})

				if (marker) {
					marker.setLngLat(coords)
				}
				draw.deleteAll()
			}
		},
		[property, map]
	)

	useEffect(() => {
		if (!map) {
			return
		}

		// parse the wkt

		// add marker to map
		const _marker = new mapboxgl.Marker()
		if (property?.WKT) {
			_marker.setLngLat(coords).addTo(map)
		}
		// const _marker = new mapboxgl.Marker().setLngLat(coords).addTo(map)

		// Init our draw
		const _draw = new MapboxDraw({
			displayControlsDefault: false,
			// Select which mapbox-gl-draw control buttons to add to the map.
			controls: {
				point: true
			}
			// Set mapbox-gl-draw to draw by default.
			// The user does not have to click the polygon control button first.
			// defaultMode: "draw_point"
		})

		// Add draw to the map
		map.addControl(_draw, "top-right")

		// Attach handler
		map.on("draw.create", (e) => handleDraw(_draw, _marker))
	}, [map])

	// Functions

	// Components

	return (
		<React.Fragment>
			<div ref={mapContainerRef} id="map-container" style={{ width: "100%" }} />
		</React.Fragment>
	)
}

export default PropertyMap
