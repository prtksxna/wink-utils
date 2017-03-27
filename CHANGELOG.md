<img width="300px" src="https://cloud.githubusercontent.com/assets/9491/22882618/0b02eb24-f212-11e6-9432-6189de9d17cc.png" />

# wink-utils

_Machine Learning, Statistics, Text Mining — The Javascript Way_



## Bug Fixes

  - *****
    - disable no-unneeded-ternary in helpers for type checking
  ([66948596](git@github.com:decisively/wink-utils.git/commit/66948596985c164328b403c2d02cea8b278cf1c0))

  - **text_nbc**
    - rectify modules' path
  ([8c74d062](git@github.com:decisively/wink-utils.git/commit/8c74d06218e3218f88c144d09b340250bdd169f7))

  - **util_regexes**
    - match complete negation token
  ([95c1876d](git@github.com:decisively/wink-utils.git/commit/95c1876d47355bcd74c3b7599e76cbfc97f12e9e),
   [#29](git@github.com:decisively/wink-utils.git/issues/29))
    - make not elision regex case insensitive
  ([a873a085](git@github.com:decisively/wink-utils.git/commit/a873a085f76d756618d872e2941b9e218bc7b166))




## Features
  - feat(compute_similarity) add jaro-winkler similarity to string
  ([ca5933d3](git@github.com:decisively/wink-utils.git/commit/ca5933d3ba1a3efb058e4942400de38e44c610a4))
  - feat(simple_stats) add population estimate to streaming.basic
  ([16173371](git@github.com:decisively/wink-utils.git/commit/1617337187d44341aaa77fdf08ac0d901712075e))

  - **compute_similarity**
    - add jaro similarity to string
  ([fcb62596](git@github.com:decisively/wink-utils.git/commit/fcb625962d6c5b06e89c5cddd716e7f88a557acb))
    - return similarity & distance from all functions
  ([3866a4f1](git@github.com:decisively/wink-utils.git/commit/3866a4f1c27e45738129d1212282f36dc76b6df2))

  - **lib**
    - add fuzzy rule-based classifier for text
  ([62d29dfa](git@github.com:decisively/wink-utils.git/commit/62d29dfa378b8a9afe363417f9c680237a9b2b69))
    - add jaro similarity
  ([30a31d43](git@github.com:decisively/wink-utils.git/commit/30a31d4319e471baff367a3960e52884cc8afbc2))
    - add naive bayes classifier for text classification
  ([01ba2bf8](git@github.com:decisively/wink-utils.git/commit/01ba2bf8258ec749230b13b2d8c24841e444bfe9))

  - **prepare_text**
    - add song - set of ngrams for string
  ([57e127b3](git@github.com:decisively/wink-utils.git/commit/57e127b3a54241d9978a20c841e1ff9ff0f8b14f))
    - rename tokens.set as sow & allow indexing
  ([065cbe10](git@github.com:decisively/wink-utils.git/commit/065cbe10144974e2735f319aedf50eb088194f31))
    - enhance bow to allow indexing
  ([ab40e2d6](git@github.com:decisively/wink-utils.git/commit/ab40e2d6041b5c8cae6e09d8edcc5f1bcdc62d86))
    - enhance bong to allow indexing
  ([7e33b293](git@github.com:decisively/wink-utils.git/commit/7e33b29352dc76d8a591b8396360494b15b505bb))
    - rename string set as soc & allow indexing
  ([56c761c7](git@github.com:decisively/wink-utils.git/commit/56c761c7ff13e84a386f6a7fc2ae70de048b33ad))
    - add index helper
  ([4459dddc](git@github.com:decisively/wink-utils.git/commit/4459dddc3f34a3e2c6a29aab84d997b84b9189c2))
    - enhance ngram for both - sequence and bag of words(bow)
  ([4ade90a9](git@github.com:decisively/wink-utils.git/commit/4ade90a9efc27ea5a56d8ef99e3e7cff6462e0ac))
    - enhance extractRunOfCapitalWords
  ([5b07dd91](git@github.com:decisively/wink-utils.git/commit/5b07dd91670f235b908caea38be7c4061cf68c1f))
    - add token phonetization
  ([f13b7b74](git@github.com:decisively/wink-utils.git/commit/f13b7b749bb2d03318e937719ec5c79140299ec7))
    - add propagate negations
  ([d29eb15e](git@github.com:decisively/wink-utils.git/commit/d29eb15ea6e63756fee6896f9567ec01fe19d30b))
    - enahnce tokenizers
  ([0a875a3e](git@github.com:decisively/wink-utils.git/commit/0a875a3eefee7ad4d97e6551e7b512f53fbdafdf))

  - **prepare_text_specs**
    - enhance bongWithIndex()
  ([397fc3a6](git@github.com:decisively/wink-utils.git/commit/397fc3a65d6252a8303fd36a10c91c9ab4905348))

  - **simple_stats**
    - add reset to all streaming functions
  ([6ea4d2b3](git@github.com:decisively/wink-utils.git/commit/6ea4d2b31297bfa407d74ec4d9ed4af776435fda))
    - allow zscore to be optional with default of 1.645
  ([ae44d9b9](git@github.com:decisively/wink-utils.git/commit/ae44d9b994ef04b0311ebea178fd4b400a9182e5))
    - add sturges histogram; reorg name space
  ([24956a96](git@github.com:decisively/wink-utils.git/commit/24956a96777822ef7c8e66af8f6e40f8a8b992a1))
    - add count cats and enhance vital few
  ([d3a94001](git@github.com:decisively/wink-utils.git/commit/d3a94001577957a9133b3face9ab92b33112811c))
    - add min, max, and mean functions to stats.streaming
  ([601c6a10](git@github.com:decisively/wink-utils.git/commit/601c6a106ede637910c58f96761c6c9675e03c46))

  - **text_nbc**
    - add reset
  ([fb68a54e](git@github.com:decisively/wink-utils.git/commit/fb68a54ebc579ee49fa0541af584d17d6d09c740))




## Documentation
  - Use 'eslint-disable-line' instead of 'eslint-disable-next-line'
  ([b3a6390b](git@github.com:decisively/wink-utils.git/commit/b3a6390bb163d9075c81d59529b0b4c1a8a23313))

  - **text_frc**
    - fix typos
  ([02a7349f](git@github.com:decisively/wink-utils.git/commit/02a7349f86214a9197bf8d42ec137b1e573ea325))
    - add comment to specify prototype & variant clearly
  ([30452aea](git@github.com:decisively/wink-utils.git/commit/30452aea7e431aacdb79de3d8cca0f325397c98d))




## Refactor

  - *****
    - make more robust type checking
  ([cf539f5e](git@github.com:decisively/wink-utils.git/commit/cf539f5e1dc31655c9bcb905491ab45e107b05cb))

  - **compute_similarity**
    - increase test coverage of createDLFunction
  ([3d64e4ef](git@github.com:decisively/wink-utils.git/commit/3d64e4ef75cd61373a77a8b252a3ecfe31144745))

  - **prepare_text**
    - remove bongWithIndex as bong has been enhanced
  ([c0b04026](git@github.com:decisively/wink-utils.git/commit/c0b040262c6c42d3eee93ed41ef3aa72109cf4b1))
    - separate out helper name space
  ([9978f507](git@github.com:decisively/wink-utils.git/commit/9978f5079438a3c1224f4134b32a428b0014aecb))

  - **text_nbc**
    - rename setPreprocessors to definePrepTasks
  ([194668b4](git@github.com:decisively/wink-utils.git/commit/194668b4b4c4a94db6ba4d31f1166ddecd2c22c4))

  - **validate**
    - revise numberWithSOM to enhance branch test coverage
  ([725881b3](git@github.com:decisively/wink-utils.git/commit/725881b396f2f61f3e75ef4e9f5402a6084368c5))




## Test
  - test(prepare_text_spec) add test case for tokenize to illustrate _ processing
  ([b1863fc2](git@github.com:decisively/wink-utils.git/commit/b1863fc25b7c4cbc390197669c572165b269969b))

  - **compute_similarity_specs, prepare_text_specs**
    - add test cases
  ([d928cb7f](git@github.com:decisively/wink-utils.git/commit/d928cb7fcd3790ac8846bc4532ca0bf69c3cc219))

  - **prepare_text_specs**
    - add test cases for propagateNegations
  ([eb6a143a](git@github.com:decisively/wink-utils.git/commit/eb6a143ac016a5199ea8e51d62963067d24dd170))
    - add test cases for tokens.phonetize
  ([398339e1](git@github.com:decisively/wink-utils.git/commit/398339e1101bd78fc30ddf365916aa006dd9b9a1))
    - remove merge conflicts, which were missed earlier
  ([59469f8f](git@github.com:decisively/wink-utils.git/commit/59469f8fa8c5a3802204db7b09b31a3fa0eec3b0))
    - manually merge
  ([4d141844](git@github.com:decisively/wink-utils.git/commit/4d1418444014dd32b4476560cd7210c03a2342fc))
    - add tests for sentences, tokenize0 and tokenize
  ([71ab73ac](git@github.com:decisively/wink-utils.git/commit/71ab73ac0cddb2f45115e5db200388c3725ec9fe))

  - **prepare_text_specs, compute_similarity_specs**
    - add test cases
  ([f952947e](git@github.com:decisively/wink-utils.git/commit/f952947e4169c7c77eaafa3af66811c1e32b0be5))

  - **text_frc**
    - complete testing & improve error messages
  ([9b19df02](git@github.com:decisively/wink-utils.git/commit/9b19df02078d040537a637ad10a0caa3f067c040))




## Pull requests merged
  - Merge pull request #30 from rachnachakraborty/master
  ([24e44057](git@github.com:decisively/wink-utils.git/commit/24e44057efd0c32ae58875ca21d00b7dc5922f9a))




