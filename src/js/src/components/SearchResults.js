import SearchResult from "./SearchResult.js";
import router from "../router/index.js";
import searchState from "../store/searchStore.js";
import AppliedFilters from "./AppliedFilters.js";

export default {
  name: "SearchResults",

  functional: true,
  props: {
    searchResults: {
      type: Array,
      required: true
    },
    facets: {
      type: Object,
      required: true
    },
    matchCount: {},
    documentCount: {}
  },
  methods: {
    filterFromFacets(name, key, props) {
      console.log(props.props.searchResults["0"].query);
      var getQuery = searchState.query;
      if (getQuery === "") {
        getQuery = router.history.current.params.query;
      }
      router.push({
        name: "search",
        params: { query: getQuery + "&fq=" + key.key + ':"' + encodeURIComponent(name.name) + '"' }
      });
    }
  },

  render: (h, { props }) => {
    return (
      <div class="searchResultContainer">
        {parseInt(props.hits) === 0 ? (
          <div class="noResultContainer">No results found. Sorry :(</div>
        ) : (
          <div class="searchResults">
            <AppliedFilters
              queryString={searchState.query || ""}
              route={router.history.current.path}
            />
            <div class="headline">Filter by:</div>
            <div class="facets">
              {Object.keys(props.facets).map(function(key) {
                var item = props.facets[key];
                if (Object.keys(props.facets).length > 1) {
                  return (
                    <div class="facet">
                      <div class="facetName">{key.split("_")[0]}</div>
                      {item.map(function(name, i) {
                        if (i % 2 == 0) {
                          return (
                            <div
                              onClick={e =>
                                this.a.methods.filterFromFacets({ name }, { key }, { props })
                              }
                              class="facetItem"
                            >
                              {name || "Unknown"}
                            </div>
                          );
                        } else {
                          return <div class="facetHitNumber">({name})</div>;
                        }
                      }, this)}
                    </div>
                  );
                } else {
                  return <div />;
                }
              }, this)}
            </div>
            <div class="headline">
              <span class="numbersFound">{props.hits}</span> matches was found in
              {props.searchResults[0] != undefined ? (
                <span class="numbersFound"> {props.searchResults[0].allHits}</span>
              ) : (
                <span class="numbersFound">0 </span>
              )}
              {props.searchResults.length > 1 || props.searchResults.length === 0 ? (
                <span> pdfs</span>
              ) : (
                <span> pdf</span>
              )}
            </div>
            {props.searchResults.map((result, index) => (
              <SearchResult
                key={router.history.current.params.query + "_" + index}
                result={result}
                queryString={router.history.current.params.query}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
};
