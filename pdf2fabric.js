
import fs from "fs";
import path from 'path';
import pdfjs from "pdfjs-dist";
import { SVGGraphics } from "./src/display/svg.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));
const { OPS, Util, ImageKind, AnnotationMode } = pdfjs

const main = async (pdfPath) => {
  

  const loadingTask = pdfjs.getDocument({
    url: pdfPath,
    cMapUrl: __dirname + "/util/cmaps/",
    cMapPacked:true
})
  
  const pdf = await loadingTask.promise
  for (let i = 1; i <= pdf.numPages; i ++) {
    const page = await pdf.getPage(i)
    const commonObjs = page.commonObjs
    const objs = page.objs
    const viewport = page.getViewport({ scale: 1.0 })
    const operatorList = await page.getOperatorList()
    const svgGfx = new SVGGraphics(commonObjs, objs);
    // svgGfx.getSVG(operatorList, viewport);
    const dependencies = await svgGfx.loadDependencies(operatorList)
    const covertOperatorList = svgGfx.convertOpList(operatorList)
    svgGfx.executeOpTree(covertOperatorList)
    // console.log(covertOperatorList)
    
    //   this.transformMatrix = _util.IDENTITY_MATRIX;
    //   this.executeOpTree(this.convertOpList(operatorList));
  }
}

await main('src/mocks/test.pdf')