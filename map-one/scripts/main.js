function App() {
  let mapJson = null
  let stateMap = null
  let overallMap = null
  let stateData = null
  let citiesData = null
  let stateDropdownChoice = null

  let currentZoom = 1
  let zoomDiff = 0.2
  const scaleExtent = [0.5, 15]


  loadData().then(({ geojson, statesData, pestsData, cities }) => {
    mapJson = geojson
    stateData = statesData
    citiesData = cities
 

    function cleanKeys(data) {
      return data.map(obj => {
        const cleanedObj = {}
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            const cleanedKey = key.trim()
            cleanedObj[cleanedKey] = obj[key]
          }
        }
        return cleanedObj
      })
    }

    const newPestsData = cleanKeys(pestsData)


    const uniqueStates = [...new Set(stateData.map((d) => d.STATE))]

    const states = (uniqueStates.map((d) => {
      return {
        label: d.trim(),
        value: d.trim()
      }
    }))

    states.push({
      label: `<div class='choice-label'>
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.5 5.84467C12.3893 5.84467 8.22498 10.009 8.22498 15.1197C8.22498 19.1447 12.1803 24.2554 14.8053 27.65L14.9803 27.8606C15.575 28.6658 16.5198 29.1211 17.5 29.1211C18.4803 29.1211 19.425 28.6658 20.0198 27.8606C20.1948 27.6158 20.3698 27.4053 20.5803 27.1606C23.2053 23.8 26.775 19.1802 26.775 15.1213C26.775 10.0106 22.6107 5.84467 17.5 5.84467ZM19.8105 26.5643C19.6355 26.809 19.425 27.0538 19.25 27.2643C18.8303 27.8249 18.2 28.1393 17.5 28.1393C16.8 28.1393 16.1697 27.8249 15.75 27.2643L15.575 27.0538C13.0197 23.7643 9.20533 18.7931 9.20533 15.1181C9.20533 10.5681 12.916 6.82342 17.5 6.82342C22.0857 6.82342 25.7946 10.5341 25.7946 15.1181C25.7946 18.8641 22.3304 23.3104 19.8105 26.5643Z" fill="#051C34"/>
          <path d="M17.5 11.1304C15.3303 11.1304 13.5803 12.8804 13.5803 15.05C13.5803 17.2197 15.3303 18.9697 17.5 18.9697C19.6696 18.9697 21.4196 17.2197 21.4196 15.05C21.4196 12.8804 19.6696 11.1304 17.5 11.1304ZM17.5 17.9897C15.8894 17.9897 14.5605 16.6594 14.5605 15.0502C14.5605 13.4397 15.8908 12.1108 17.5 12.1108C19.1105 12.1108 20.4394 13.4411 20.4394 15.0502C20.4394 16.6608 19.1105 17.9897 17.5 17.9897Z" fill="#051C34"/>
        </svg>
        <div>Select State</div>
      </div>`,
      value: 'Select State'
    })

    states.sort((a, b) => {
      const specialLabel = "Select State"

      if (a.label === specialLabel && b.label !== specialLabel) {
        return -1 // a comes before b
      }
      if (b.label === specialLabel && a.label !== specialLabel) {
        return 1
      }
      if (a.label < b.label) {
        return -1
      }
      if (a.label > b.label) {
        return 1
      }
      return 0
    })


    const topTenStates = stateData.sort((a, b) => a['OVERALL RANKING'])

    const headers = [
      {
        label: 'Rank',
        icon: './images/iconss/rank.svg',
        fieldValue: 'OVERALL RANKING',
        width: '10%'
      },
      {
        label: 'State',
        icon: './images/iconss/state.svg',
        fieldValue: 'STATE',
        width: '10%'
      },
      {
        label: 'Search',
        icon: './images/iconss/search.svg',
        fieldValue: 'RANK FOR SEARCH VOLUME',
        width: '10%'
      },
      // {
      //   label: 'Peak Month',
      //   icon: './images/iconss/peakMonth.svg',
      //   fieldValue: 'MOST SEARCHED MONTH',
      //   width: '15%'
      // },
      {
        label: 'Rainfall',
        icon: './images/iconss/rainfall.svg',
        fieldValue: 'RANK FOR RAINFALL',
        width: '10%'
      },
      {
        label: 'Sunshine',
        icon: './images/iconss/sunshine.svg',
        fieldValue: 'RANK FOR SUNSHINE',
        width: '10%'
      },
      {
        label: 'Housing Age',
        icon: './images/iconss/housingAge.svg',
        fieldValue: 'RANK FOR HOUSING AGE',
        width: '15%'
      },
      {
        label: 'Population',
        icon: './images/iconss/population.svg',
        fieldValue: 'RANK FOR POPULATION DENSITY',
        width: '10%'
      }
    ]

    const cityHeaders = [
      {
        label: 'Rank',
        icon: './images/iconss/rank.svg',
        fieldValue: 'OVERALL RANKING',
        width: '10%'
      },
      {
        label: 'City',
        icon: './images/iconss/state.svg',
        fieldValue: 'CITY',
        width: '10%'
      },
      {
        label: 'Search',
        icon: './images/iconss/search.svg',
        fieldValue: 'RANK FOR SEARCH VOLUME',
        width: '10%'
      },
      {
        label: 'Peak Month',
        icon: './images/iconss/peakMonth.svg',
        fieldValue: 'MOST SEARCHED MONTH',
        width: '15%'
      },
      {
        label: 'Rainfall',
        icon: './images/iconss/rainfall.svg',
        fieldValue: 'RANK FOR RAINFALL',
        width: '10%'
      },
      {
        label: 'Sunshine',
        icon: './images/iconss/sunshine.svg',
        fieldValue: 'RANK FOR SUNSHINE',
        width: '10%'
      },
      {
        label: 'Housing Age',
        icon: './images/iconss/housingAge.svg',
        fieldValue: 'RANK FOR HOUSING AGE',
        width: '15%'
      },
      {
        label: 'Population',
        icon: './images/iconss/population.svg',
        fieldValue: 'RANK FOR POPULATION DENSITY',
        width: '10%'
      }
    ]


    const stateTableHeader = [{
      label: 'Rank',
      icon: './images/newIcons/rank.svg',
      fieldValue: 'OVERALL RANK',
      width: '20%'
    },
    {
      label: 'Pest',
      icon: './images/newIcons/control.svg',
      fieldValue: 'pest',
      width: '60%'
    },
    {
      label: 'Searches',
      icon: './images/newIcons/search.svg',
      fieldValue: 'Total number of pest-related search queries',
      width: '20%'
    }
    ]

    const newMapData = stateData.reduce((obj, d) => {
      obj[d['STATE'].trim()] = d["OVERALL RANKING"]
      return obj
    }, {})

    const newSearchMapData = stateData.reduce((obj, d) => {
      obj[d['STATE'].trim()] = d["RANK FOR SEARCH VOLUME"]
      return obj
    }, {})


    const stateNameToAbbr = {
      "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
      "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
      "District of Columbia": "DC", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI",
      "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
      "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME",
      "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN",
      "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE",
      "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM",
      "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
      "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI",
      "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX",
      "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA",
      "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
    }

    const getTooltipContent = (name, value, target, version, searchValue) => {
      if (!value) return
      const searchRankText = searchValue ? `Search Rank: ${ordinal_suffix_of(searchValue)}` : ''
      const nameAndRank = `
         <div class='tooltip-content'>
        <div class="name-and-rank">
          <div class='name'> ${name} </div>
          <div class='rank-value'> #${ordinal_suffix_of(value)} </div> 
        </div>
        ${searchRankText ? `<div class='search-rank'> ${searchRankText} </div>` : ''}
        </div> 
        `

      if (version === "mini") {
        return nameAndRank
      }
      return
    }

    const getCityTooltipContent = (city) => {
      if (!city) return '';
      
      const overallRank = city['OVERALL RANK'] || '';
      const searchRank = city['RANK FOR GSV'] || '';
      const peakMonth = city['MOST SEARCHED MONTH'] || '';
      const cityName = city.CITY || '';

      return `
        <div class='tooltip-content'>
          <div class="name-and-rank">
            <div class='name'>${cityName}</div>
            <div class='rank-value'>#${ordinal_suffix_of(overallRank)}</div>
          </div>
          <div class='search-rank'>Search Rank: ${ordinal_suffix_of(searchRank)}</div>
          <div class='peak-month'>Peak Month: ${peakMonth}</div>
        </div>
      `;
    }

    function mapCityToTableFormat(city) {
      return {
        'OVERALL RANKING': city['OVERALL RANK'],
        'CITY': city.CITY,
        'RANK FOR SEARCH VOLUME': city['RANK FOR GSV'],
        'MOST SEARCHED MONTH': city['MOST SEARCHED MONTH'],
        'RANK FOR RAINFALL': city['RANK FOR PRECIPITATION'],
        'RANK FOR SUNSHINE': city['RANK FOR TEMPERATURE'],
        'RANK FOR HOUSING AGE': city['RANK FOR YEAR BUILT'],
        'RANK FOR POPULATION DENSITY': city['RANK FOR POPULATION DENSITY']
      }
    }

    function drawCitiesTable(stateName) {
      // console.log(stateName)
      const stateAbbrCode = stateNameToAbbr[stateName]
      if (!stateAbbrCode || !citiesData) return

      const citiesInState = citiesData
        .filter(city => city.STATE === stateAbbrCode)
        .map(mapCityToTableFormat)
        .sort((a, b) => a['OVERALL RANKING'] - b['OVERALL RANKING'])

      if (citiesInState.length > 0) {
        drawTable(cityHeaders, citiesInState, `Top Ranking ${stateName} cities` , '798px')
      }
    }

    function initMaps(newMapData, citiesData) {
      overallMap = USMap({
        container: "#overall_map",
        desktopHeight: 450,
        mobileHeight: 200,
        geojson: mapJson,
        data: newMapData,
        searchData: newSearchMapData,
        cities: citiesData,
        colors: ['#E02127', '#CE2531', '#BB2A3C', '#A92E46', '#963250', '#84375B', '#713B65', '#5F3F6F', '#4D447A', '#3A4884', '#284C8E', '#155199', '#0355A3'],
        tooltipContent: ({ name, value, searchValue }, version) => {
          return getTooltipContent(name, value, 'test', version, searchValue)
        },
        cityTooltipContent: (city) => {
          return getCityTooltipContent(city)
        },
        onStateClick: (stateName) => {
          drawCitiesTable(stateName)
        },
        onReset: () => {
          drawTable(headers, topTenStates, 'Top ranking States for pest infestation', '798px')
        }
      }).render()

    }

    stateDropdownChoice = initDropdown({
      list: states,
      id: "#categories_select",
      // placeholder: `<div class='choice-label'>
      // 				<svg width="19" height="25" viewBox="0 0 19 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      // <path d="M9.50001 0.844666C4.38931 0.844666 0.225006 5.00897 0.225006 10.1197C0.225006 14.1447 4.18036 19.2554 6.80536 22.65L6.98036 22.8606C7.57508 23.6658 8.5198 24.1211 9.50008 24.1211C10.4804 24.1211 11.4251 23.6658 12.0198 22.8606C12.1948 22.6158 12.3698 22.4053 12.5804 22.1606C15.2054 18.8 18.775 14.1802 18.775 10.1213C18.775 5.01056 14.6107 0.844666 9.50001 0.844666ZM11.8106 21.5643C11.6356 21.809 11.425 22.0538 11.25 22.2643C10.8303 22.8249 10.2 23.1393 9.50001 23.1393C8.80001 23.1393 8.16973 22.8249 7.75001 22.2643L7.57501 22.0538C5.01973 18.7643 1.20536 13.7931 1.20536 10.1181C1.20536 5.56807 4.91606 1.82342 9.50001 1.82342C14.0857 1.82342 17.7947 5.53412 17.7947 10.1181C17.7947 13.8641 14.3304 18.3104 11.8106 21.5643Z" fill="#324C3D"/>
      // <path d="M9.5 6.13037C7.33028 6.13037 5.58035 7.88037 5.58035 10.05C5.58035 12.2197 7.33035 13.9697 9.5 13.9697C11.6697 13.9697 13.4197 12.2197 13.4197 10.05C13.4197 7.88037 11.6697 6.13037 9.5 6.13037ZM9.5 12.9897C7.88944 12.9897 6.56056 11.6594 6.56056 10.0502C6.56056 8.43967 7.89084 7.11079 9.5 7.11079C11.1106 7.11079 12.4394 8.44107 12.4394 10.0502C12.4394 11.6608 11.1105 12.9897 9.5 12.9897Z" fill="#324C3D"/>
      // </svg>
      // 			<div>	Select State </div>
      // 				</div>`,
      searchPlaceholderValue: 'Search',
      searchEnabled: true,

      cb: (state) => {
        // show tooltip
        if (state !== 'Select State') {
          if (overallMap && typeof overallMap.selectState === 'function') {
            currentZoom = overallMap.selectState(state) || 1
          }

          const foundStateObject = stateData.find((d) => d['STATE'].trim() === state)
          const foundRank = foundStateObject['OVERALL RANKING']
          const foundSearchRank = foundStateObject['RANK FOR SEARCH VOLUME']
          const foundState = foundStateObject['STATE']
          const version = "mini"
          
          // Delay showing tooltip until zoom transition has finished,
          // so the tooltip is positioned on the zoomed-in state.
          setTimeout(() => {
            const specificPathNode = d3.select(`path[data-state='${state}']`).node()
            if (!specificPathNode) {
              console.error(`Path node for county '${state}' not found.`)
              return
            }

            if (specificPathNode._dropdownTippy) {
              specificPathNode._dropdownTippy.destroy()
              specificPathNode._dropdownTippy = null
            }

            const instance = tippy(specificPathNode, {
              content: getTooltipContent(foundState, foundRank, 'test', version, foundSearchRank),
              allowHTML: true,
              arrow: true,
              theme: 'light',
              animation: 'scale',
              placement: 'top',
              trigger: 'manual'
            })

            instance.show()
            specificPathNode._dropdownTippy = instance
          }, 800)

          // redraw table
          // const chosenStatePests = newPestsData.filter((d) => d.Keyword !== "Total search volume").slice()
          //   .sort((a, b) => {
          //     return b[state] - a[state]
          //   }
          //   )
          //   .slice(0, 10).map((d, index) => {
          //     return {
          //       'STATE': state,
          //       Ranking: index + 1,
          //       'Total number of pest-related search queries': d[state],
          //       pest: d.Keyword
          //     }
          //   })
          // drawTable(stateTableHeader, chosenStatePests, `Top 10 most common pest searches in ${state}`, '400px')
        }

        if (state === 'Select State') {
          currentZoom = 1
          if (overallMap && typeof overallMap.resetZoom === 'function') {
            overallMap.resetZoom()
          } else {
            drawTable(headers, topTenStates, 'Top 10 States most affected by pest infestations', '798px')
          }
        }

      }
    })


    drawTable(headers, topTenStates, 'Top ranking States for pest infestation', '798px')
    initMaps(newMapData, citiesData)
    addEvents()
  })

  function loadData() {
    return Promise.all([
      d3.json("./data/map.json"),
      d3.csv('./data/alldata-statess.csv', d3.autoType),
      d3.csv('./data/Pest-by-states.csv', d3.autoType),
      d3.csv('./data/alldata-new.csv', d3.autoType)
    ]).then(([geojson, statesData, pestsData, cities]) => {
      return { geojson, statesData, pestsData, cities }
    })
  }

  function addEvents() {
    d3.select(window).on("resize", () => {
      overallMap.resize()
      stateMap.resize()
    })
  }


  function drawTable(headers, data, title, width) {
    d3.select('.table-box').style('width', window.innerWidth < 576 ? '100%' : width)
    d3.select('.table-title').html(title)
    const table = d3.select('#table')

    const tableHeader = table
      .selectAll('.table-header-row')
      .data(['tr'])
      .join('tr')
      .attr('class', 'table-header-row')

    tableHeader.selectAll('th')
      .data(headers)
      .join('th')
      .style('width', (d) => d.width)
      .html((d) => `<div class='header-box ${d.label.toLowerCase()}'> 
			  <img src= ${d.icon} class='table-icon' />
				<div class='header-label'> ${d.label} </div>
			</div>`)

    const tableRows = table
      .selectAll('.table-body-row')
      .data(data)
      .join('tr')
      .attr('class', 'table-body-row')



    tableRows
      .selectAll('td')
      .data((d) => {
        return headers.map((header) => d[header.fieldValue])
      })
      .join('td')
      .text((d, index) => {
        return index === 1 || index === 3 ? d : ordinal_suffix_of(d)
      })
  }

  d3.select('#zoom_in').on('click', () => {
    if (currentZoom + zoomDiff <= scaleExtent[1]) {
      currentZoom = currentZoom + zoomDiff
    }
    overallMap.zoom(currentZoom)
  })

  d3.select("#zoom_out").on('click', () => {
    currentZoom = 1
    if (overallMap && typeof overallMap.resetZoom === 'function') {
      overallMap.resetZoom()
    }

    // Reset dropdown selection back to "Select State"
    if (stateDropdownChoice && typeof stateDropdownChoice.setChoiceByValue === 'function') {
      stateDropdownChoice.setChoiceByValue('Select State')
    } else {
      const selectEl = document.querySelector('#categories_select')
      if (selectEl) {
        selectEl.value = 'Select State'
        if (typeof triggerEvent === 'function') {
          triggerEvent(selectEl, 'change')
        }
      }
    }
  })

}

window.addEventListener("DOMContentLoaded", App)