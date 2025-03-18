import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
		config.module.rules.push({
			test: /\.(xlsx|xls|csv)(\?.*)?$/,
			use: "webpack-xlsx-loader"
		})

		config.module.rules.push({
			test: /\.(eot|svg|ttf|woff|woff2)$/,
			loader: "file-loader"
		})

		// Important: return the modified config
		return config
	}
}

export default nextConfig
