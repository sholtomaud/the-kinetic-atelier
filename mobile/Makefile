.PHONY: build test lint clean

build:
	swift build

test:
	swift test

lint:
	if which swiftlint >/dev/null; then \
		swiftlint; \
	else \
		echo "warning: SwiftLint not installed, download from https://github.com/realm/SwiftLint"; \
	fi

clean:
	swift package clean
	rm -rf .build
