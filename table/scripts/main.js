function App() {
  let showMore = true
  loadData().then(({ data }) => {
    let tableData = []
    const headers = [
      {
        label: 'Rank',
        icon: './images/iconss/rank.svg',
        fieldValue: 'OVERALL RANK',
        width: "10%",
      },
      {
        label: 'State',
        icon: './images/iconss/state.svg',
        fieldValue: 'CITY',
        width: "25%",
      },
      {
        label: 'Search',
        icon: './images/iconss/search.svg',
        fieldValue: 'RANK FOR GSV',
        width: "10%",
      },
      {
        label: 'Peak',
        icon: './images/iconss/peakMonth.svg',
        fieldValue: 'MOST SEARCHED MONTH',
        width: "15%",
      },
      {
        label: 'Rain',
        icon: './images/iconss/rainfall.svg',
        fieldValue: 'RANK FOR PRECIPITATION',
        width: "15%",
      },
      {
        label: 'Sun',
        icon: './images/iconss/sunshine.svg',
        fieldValue: 'RANK FOR TEMPERATURE',
        width: "10%",
      },
      {
        label: 'Housing Age',
        icon: './images/iconss/housingAge.svg',
        fieldValue: 'RANK FOR YEAR BUILT',
        width: "20%",
      },
      {
        label: 'Population',
        icon: './images/iconss/population.svg',
        fieldValue: 'RANK FOR POPULATION DENSITY',
        width: "30%",
      },
    ]

    drawTable(headers, data.filter((d, i) => i <= 9))


    addEvents()
  })

  function loadData() {
    return Promise.all([
      d3.csv('./data/alldata-new.csv', d3.autoType)
    ]).then(([data]) => {
      return { data }
    })
  }

  function addEvents() {
    d3.select(window).on("resize", () => {
      overallMap.resize()
      stateMap.resize()
    })
  }


  function drawTable(headers, data) {
    const table = d3.select('#table')

    // Copy of data we can resort without mutating original
    let currentData = data.slice()

    // Track sort direction per column (true = ascending, false = descending)
    const sortDirections = {}

    const tableHeader = table
      .selectAll('.table-header-row')
      .data(['tr'])
      .join('tr')
      .attr('class', 'table-header-row')

    const headerCells = tableHeader.selectAll('th')
      .data(headers)
      .join('th')
      .style('width', (d) => d.width)
      .html((d) => `<div class='header-box'> 
			  <img src= ${d.icon} class='table-icon' />
				<div class='header-label'> ${d.label} </div>
			</div>`)

    const colors = ['#E02127', '#CE2531', '#BB2A3C', '#A92E46', '#963250', '#84375B', '#713B65', '#5F3F6F', '#4D447A', '#3A4884', '#284C8E', '#155199', '#0355A3']

    function renderBody() {
      const tableRows = table
        .selectAll('.table-body-row')
        .data(currentData)
        .join('tr')
        .attr('class', 'table-body-row')

      tableRows
        .selectAll('td')
        .data((d) => {
          return headers.map((header) => d[header.fieldValue])
        })
        .join('td')
        .text((d, index) => {
          // Keep month and state as plain text, others as ordinal ranks
          return index === 3 || index === 1 ? d : ordinal_suffix_of(d)
        })

      // Color for the first column after each render
      table.selectAll('.table-body-row td:nth-child(1)')
        .style('border-left', function () {
          const rowData = d3.select(this.parentNode).datum()
          return `5px ${colors[rowData['OVERALL RANK']]} solid`
        })
    }

    // Initial render
    renderBody()

    // Click on headers to sort by that column
    headerCells.on('click', (_, header) => {
      const field = header.fieldValue
      if (field === 'STATE' || field === 'CITY') return
      const isAsc = sortDirections[field] === true

      currentData = currentData.slice().sort((a, b) => {
        const va = a[field]
        const vb = b[field]

        if (va == null && vb == null) return 0
        if (va == null) return 1
        if (vb == null) return -1

        let comparison
        if (typeof va === 'number' && typeof vb === 'number') {
          comparison = va - vb
        } else {
          comparison = String(va).localeCompare(String(vb))
        }

        // Toggle direction on each click
        return isAsc ? -comparison : comparison
      })

      sortDirections[field] = !isAsc
      renderBody()
    })
  }



}

window.addEventListener("DOMContentLoaded", App)