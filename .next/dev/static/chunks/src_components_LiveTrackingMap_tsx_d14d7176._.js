(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/LiveTrackingMap.tsx [app-client] (ecmascript, next/dynamic entry, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "static/chunks/node_modules_11cd6a26._.js",
  "static/chunks/src_components_LiveTrackingMap_tsx_272c4042._.js",
  {
    "path": "static/chunks/node_modules_leaflet_dist_leaflet_ef5f0413.css",
    "included": [
      "[project]/node_modules/leaflet/dist/leaflet.css [app-client] (css)"
    ]
  },
  "static/chunks/src_components_LiveTrackingMap_tsx_f358c4a8._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/components/LiveTrackingMap.tsx [app-client] (ecmascript, next/dynamic entry)");
    });
});
}),
]);