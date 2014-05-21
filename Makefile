# xtetsuji at 2014/04/24

TMP_DIR		= /tmp

APP_NAME	= ytv2gcalep
BUILD_ROOT_DIR	= $(TMP_DIR)/chrome-extension-build
BUILD_DIR	= $(BUILD_ROOT_DIR)/$(APP_NAME)

MATERIALS	= images manifest.json ytv2gcalep.js

DIR_OPEN_CMD	= open

usage:
	@echo "Usage:"
	@echo "  make prepare"
	@echo "  make build"
	@echo "  make copy-builddir"
	@echo "  make clean"

prepare:
	mkdir -p $(BUILD_DIR)
	cp -r $(MATERIALS) $(BUILD_DIR)/
	$(DIR_OPEN_CMD) $(BUILD_DIR)/

build:
	@read -p "Update manifest.json version number?[y/N]: " bool ; \
	if [[ $$bool =~ ^[yY](es)? ]] ; then true ; else false ; fi
	cd $(BUILD_ROOT_DIR) ; \
	zip -r $(APP_NAME).zip $(APP_NAME)
	@echo "Build success! Upload $(BUILD_ROOT_DIR)/$(APP_NAME).zip on Chroem developer console."

copy-builddir:
	echo $(BUILD_ROOT_DIR) | pbcopy
	echo "cd <PASTE>"

clean:
	rm -rfv $(BUILD_DIR)
