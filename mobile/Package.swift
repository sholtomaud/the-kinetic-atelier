// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "KineticAtelierCore",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "KineticAtelierCore",
            targets: ["KineticAtelierCore"]),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "KineticAtelierCore",
            dependencies: []),
        .testTarget(
            name: "KineticAtelierCoreTests",
            dependencies: ["KineticAtelierCore"]),
    ]
)
