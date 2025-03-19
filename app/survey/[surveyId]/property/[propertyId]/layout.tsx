"use client"

import React from "react"

function PropertyLayout({ children }: { children: React.ReactNode }) {
	// Refs

	// State

	// Effects

	// Functions

	// Components

	return (
		<React.Fragment>
			<main className="flex flex-grow h-full">{children}</main>
			<footer
				style={{
					// position: "fixed",
					// bottom: 0,
					width: "100%",
					textAlign: "center",
					fontSize: "12px",
					backgroundColor: "#f9f9f9",
					borderTop: "1px solid #e0e0e0",
					padding: "18px"
				}}
			>
				<p>
					© {new Date().getFullYear()} Cresa. All rights reserved. The information contained herein is for
					informational purposes only and does not constitute legal advice.
				</p>
			</footer>
		</React.Fragment>
	)
}

export default PropertyLayout
