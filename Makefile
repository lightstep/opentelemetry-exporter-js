.PHONY: clone
clone:
	git clone git@github.com:googleapis/googleapis.git ../googleapis
	git clone git@github.com:lightstep/lightstep-tracer-common.git ../lightstep-tracer-common

latest:
	cd ../googleapis
	git pull
	cd ../lightstep-tracer-common
	git pull

.PHONY: proto
proto:
	protoc -I"$(PWD)/../googleapis/:$(PWD)/../lightstep-tracer-common/" \
		--js_out=import_style=commonjs,binary:src/generated_proto \
		collector.proto google/api/annotations.proto google/api/http.proto
