import isEqual from 'lodash-es/isEqual'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { store } from '../redux/store.js'

setOptions({
  key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  v: 'weekly',
  mapIds: [import.meta.env.VITE_GOOGLE_MAPS_ID]
})

class Map extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.markers = []
    this.data = []
    this.map = null
    this.unsubscribe = null
    this.pinElement = null
    this.pinElements = []
    this.pinElementMarker = null
    this.pinElementMarkers = []
  }

  async connectedCallback () {
    await this.loadData()
    await this.render()

    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.map.pinElement.latitude && !isEqual(currentState.map.pinElement, this.pinElement)) {
        this.pinElement = currentState.map.pinElement
        this.showPinElement(currentState.map.pinElement)
      }

      if (currentState.map.pinElements.length > 0 && !isEqual(currentState.map.pinElements, this.pinElements)) {
        this.pinElements = currentState.map.pinElements
        this.showPinElements(currentState.map.pinElements)
      }
    })
  }

  async loadData () {
    const response = await fetch('./data/data.json');
    this.data = await response.json()
  }

  async render () {
    this.shadow.innerHTML =
    /* html */`<style>

      :host {
        display: block;
        height: 100%;
        width: 100%;
      }

      .map {
        height: 100%;
        width: 100%;
      }

      .gm-style iframe + div { border:none!important; }
    </style>

    <div class="map"></div>
    `

    await this.loadMap()
  }

  async loadMap () {
    if (this.map) return

    const { Map } = await importLibrary('maps')
    // const { AdvancedMarkerElement, PinElement } = await importLibrary('marker')

    this.map = new Map(this.shadow.querySelector('.map'), {
      backgroundColor: 'hsl(217, 89%, 79%)',
      center: { lat: 39.6135612, lng: 2.8820133 },
      clickableIcons: false,
      disableDefaultUI: true,
      mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
      minZoom: 10,
      restriction: {
        latLngBounds: {
          east: 4.649715,
          north: 40.971935,
          south: 38.204442,
          west: 1.160065
        },
        strictBounds: true
      },
      zoom: 10
    })

    // this.markers.forEach(marker => marker.setMap(null))
    // this.markers = []

    // this.data.filter(element => element.latitude && element.longitude).slice(0, 10).forEach((element) => {
    //   const pinView = new PinElement({
    //     background: 'hsl(280deg 56% 47%)',
    //     borderColor: 'hsl(0deg 0% 0%)',
    //     glyphColor: 'hsl(0deg 0% 0%)'
    //   })

    //   const marker = new AdvancedMarkerElement({
    //     map: this.map,
    //     position: { lat: element.latitude, lng: element.longitude },
    //     title: element.name,
    //     content: pinView.element
    //   })

    //   this.markers.push(marker)
    // })
  }

  async showPinElement(pinElement) {

    const { AdvancedMarkerElement, PinElement } = await importLibrary('marker')

    if (this.pinElementMarker) {
      this.pinElementMarker.setMap(null)
    }
  
    const pinView = new PinElement({
      background: 'hsl(280deg 56% 47%)',
      borderColor: 'hsl(0deg 0% 0%)',
      glyphColor: 'hsl(0deg 0% 0%)'
    })

    this.pinElementMarker = new AdvancedMarkerElement({
      map: this.map,
      position: { lat: parseFloat(pinElement.latitude), lng: parseFloat(pinElement.longitude) },
      title: pinElement.name,
      content: pinView.element
    })
  }

  async showPinElements(pinElements) {

    const { AdvancedMarkerElement, PinElement } = await importLibrary('marker')

    if (this.pinElementMarkers.length > 0) {
      this.pinElementMarkers.forEach(pinElement => {
        pinElement.setMap(null)
      });
    }

    pinElements.forEach(pinElement => {
      const pinView = new PinElement({
        background: 'hsl(280deg 56% 47%)',
        borderColor: 'hsl(0deg 0% 0%)',
        glyphColor: 'hsl(0deg 0% 0%)'
      })

      const pinElementMarker = new AdvancedMarkerElement({
        map: this.map,
        position: { lat: parseFloat(pinElement.latitude), lng: parseFloat(pinElement.longitude) },
        title: pinElement.name,
        content: pinView.element
      })

      this.pinElementMarkers.push(pinElementMarker)
    })
  }
}

customElements.define('map-component', Map)