.PHONY: build build/game build/dict.cpp build/dict

MAKE_FLAGS=-j $$(nproc)

# ---------------------------------------------------------------------------- #
#     Complete build script.
# ---------------------------------------------------------------------------- #
build:
  # Build React Page
	make $(MAKE_FLAGS) clean
	make $(MAKE_FLAGS) build/game

  # Remove Developer games
	rm -rf build/dict/**

  # Build Dictionaries
	make $(MAKE_FLAGS) build/dict.cpp

	make $(MAKE_FLAGS) build/dict DICT=da-DK
	mv out build/dict/da-DK

	make $(MAKE_FLAGS) build/dict DICT=de-DE
	mv out build/dict/de-DE

	make $(MAKE_FLAGS) build/dict DICT=en-US
	mv out build/dict/en-US

	make $(MAKE_FLAGS) build/dict DICT=es-ES
	mv out build/dict/es-ES

    # Add CNAME record
    # https://stackoverflow.com/questions/9082499/custom-domain-for-github-project-pages
	echo "wordrow.io" > build/CNAME

# ---------------------------------------------------------------------------- #
#     Build React application.
# ---------------------------------------------------------------------------- #
build/game:
	cd game && npm install
	cd game && npm run build
	mv ./game/build ./build

# ---------------------------------------------------------------------------- #
#     Build Anatree and Dictionary parser.
# ---------------------------------------------------------------------------- #
build/dict.cpp:
	mkdir -p dict.cpp/build/
	cd dict.cpp/build/ && cmake -D CMAKE_BUILD_TYPE=Debug \
                              -D CMAKE_C_FLAGS=$(O2_FLAGS) \
                              -D CMAKE_CXX_FLAGS=$(O2_FLAGS) \
                        ..
	cd dict.cpp/build/ && make $(MAKE_FLAGS) anagrams

# ---------------------------------------------------------------------------- #
#     Build .json files for the games for the given language.
# ---------------------------------------------------------------------------- #
build/dict: MIN := 3
build/dict: MAX := 6
build/dict: DICT := da-DK
build/dict:
	mkdir -p out/
	rm -f ./out/*.json

	./dict.cpp/build/src/anagrams $(MIN) $(MAX) ./dict/$(DICT)/$(DICT).txt

# ---------------------------------------------------------------------------- #
#     Remove all build files.
# ---------------------------------------------------------------------------- #
clean:
	rm -rf ./build
	rm -rf ./out

	cd dict.cpp && make $(MAKE_FLAGS) clean clean/out
