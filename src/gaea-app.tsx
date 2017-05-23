import GaeaRender from "gaea-render"
import * as LZString from "lz-string"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { BrowserRouter, Route, Switch } from "react-router-dom"

export function gaeaApp(value: string, root: HTMLElement, extraComponentClasses: any[] = []) {
  const config = JSON.parse(LZString.decompressFromBase64(value))

  /**
   * 获得某个 page 完整 url 路径
   */
  function getFullPath(pageKey: string) {
    const pageInfo = config.pages[pageKey]

    if (pageInfo.type !== "page") {
      return null
    }

    let realPath = pageInfo.path

    let tempPageInfo = pageInfo
    while (tempPageInfo.parentKey !== null) {
      const parentPageInfo = config.pages[tempPageInfo.parentKey]
      realPath = parentPageInfo.path + "/" + realPath
      tempPageInfo = parentPageInfo
    }

    return realPath
  }

  const Routes = Object.keys(config.pages)
    .filter((pageKey: string, index: number) => config.pages[pageKey].type === "page")
    .map((pageKey: string, index: number) => {
      return (
        <Route exact path={"/" + getFullPath(pageKey)} render={props => {
          const pageInfo = config.instancesArray.find((info: any) => info.pageKey === pageKey)
          return <GaeaRender {...props} value={pageInfo.instances} componentClasses={extraComponentClasses} />
        }} />
      )
    })

  ReactDOM.render((
    <BrowserRouter>
      <Switch>
        {Routes}
      </Switch>
    </BrowserRouter>
  ), root)
}
