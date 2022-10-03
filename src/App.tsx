import * as React from 'react'
import './App.css'

// @ts-ignore
import ringer from "./qwert3.mp3";// @ts-ignore
import smeh from "./smeh.mp3";

const Mine = -1;

function createField(size: number): number[] {
    const field: number[] = new Array(size * size).fill(0);

    function inc(x: number, y: number) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
            if (field[y * size + x] === Mine) return;

            field[y * size + x] += 1;
        }
    }

    for (let i = 0; i < /* количество мин */ size;) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);

        if (field[y * size + x] === Mine) continue;

        field[y * size + x] = Mine;

        i += 1;

        inc(x + 1, y);
        inc(x - 1, y);
        inc(x, y + 1);
        inc(x, y - 1);
        inc(x + 1, y - 1);
        inc(x - 1, y - 1);
        inc(x + 1, y + 1);
        inc(x - 1, y + 1);
    }

    return field;
}

enum Mask {
    Transparent,
    Fill,
    Flag,
    Question,
}

const mapMaskToView: Record<Mask, React.ReactNode> = {
    [Mask.Transparent]: null,
    [Mask.Fill]: "🌿",
    [Mask.Flag]: "🏴",
    [Mask.Question]: "❓",
};

export default function App() {
    const size = 6;
    const dimension = new Array(size).fill(null);

    const [death, setDeath] = React.useState(false);
    const [field, setField] = React.useState<number[]>(() => createField(size));
    const [mask, setMask] = React.useState<Mask[]>(() => new Array(size * size).fill(Mask.Fill));

    const win = React.useMemo(() => !field.some(
            (f, i) =>
                f === Mine && mask[i] !== Mask.Flag
                && mask[i] !== Mask.Transparent
        ),
        [field, mask],
    );

    let sum =0
    function arraySum(array: any){
       sum = 0;
        for(let i = 0; i < array.length; i++){
            if (array[i] === -1){
                sum += array[i];
            }
        }
    }
    arraySum(field)
    let result2 = mask.reduce(function(sum, elem) {
        if (elem >= 0) {
            return sum + elem;
        } else {
            return sum;
        }
    });


    let screenWidth = window.innerWidth
    let fieldWidth = screenWidth / size


    return (
        <div style={{padding: 10}}>
           <img style={{width: "100%", height: 100}} src="data:image/jpeg;base64,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"/>

            {!death ? <audio src={ringer} autoPlay={true}/> : null}

            {dimension.map((_, y) => {
                return (<div key={y} style={{display: "flex"}}>
                    {dimension.map((_, x) => {
                        return (<div
                            key={x}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: fieldWidth,
                                height: 40,
                                margin: 1,
                                backgroundColor: death ? "#FAA" : win || sum * (-1) === result2 ? "#FFB" : "#BEB",
                            }}
                            onClick={() => {
                                if (win || death || sum * (-1) === result2) return;

                                if (mask[y * size + x] === Mask.Transparent) return;

                                const clearing: [number, number][] = [];

                                function clear(x: number, y: number) {
                                    if (x >= 0 && x < size && y >= 0 && y < size) {
                                        if (mask[y * size + x] === Mask.Transparent) return;

                                        clearing.push([x, y]);
                                    }
                                }

                                clear(x, y);

                                while (clearing.length) {
                                    const [x, y] = clearing.pop()!!;

                                    mask[y * size + x] = Mask.Transparent;

                                    if (field[y * size + x] !== 0) continue;

                                    clear(x + 1, y);
                                    clear(x - 1, y);
                                    clear(x, y + 1);
                                    clear(x, y - 1);
                                }

                                if (field[y * size + x] === Mine) {
                                    mask.forEach((_, i) => mask[i] = Mask.Transparent);

                                    setDeath(true);
                                }

                                setMask((prev) => [...prev]);
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                if (win || death || sum * (-1) === result2) return;

                                if (mask[y * size + x] === Mask.Transparent) return;

                                if (mask[y * size + x] === Mask.Fill) {
                                    mask[y * size + x] = Mask.Flag;
                                } else if (mask[y * size + x] === Mask.Flag) {
                                    mask[y * size + x] = Mask.Question;
                                } else if (mask[y * size + x] === Mask.Question) {
                                    mask[y * size + x] = Mask.Fill;
                                }

                                setMask((prev) => [...prev]);
                            }}
                        >{
                            mask[y * size + x] !== Mask.Transparent
                                ? mapMaskToView[mask[y * size + x]]
                                : field[y * size + x] === Mine
                                    ?
                                    <>
                                        {/*💣*/}
                                    <img style={{width: fieldWidth-10, height: 40}} src="https://media.tenor.com/hC1Lv11C5iEAAAAM/bomb-boom.gif"/>
                                    </>

                                    : field[y * size + x]
                        }</div>);
                    })}
                </div>);
            })}
            {death ?
                <>

                    <img style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%"}}
                         src="https://pa1.narvii.com/6921/5349f2694b8efa5212b0c99a324d622cdb35ac38r1-678-382_hq.gif"/>
                    <audio src={smeh} autoPlay={true}/>
                </>
                 : null}
            {death || sum * (-1) === result2 ? <button style={{
                position: "absolute",
                top: "150px",
                left: "38%",
                // backgroundColor: "green",
                width: 100,
                height: 100,
                borderRadius: "100%",

            }} onClick={()=>window.location.reload()}><img style={{width: 80,mixBlendMode: "multiply" }} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThAXDntiIJ4L9K0jiguL2QuaS3UjfwatT2bQ&usqp=CAU"/></button> : null}
            {!death && !(sum * (-1) === result2) ? <img style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%"}}
                           src="https://thumbs.gfycat.com/AggravatingDeficientEstuarinecrocodile-size_restricted.gif"/> : null}
            {sum * (-1) === result2 ?
                <img style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
            }}
                     src="https://c.tenor.com/pDFiSRmPejsAAAAd/paw-patrol.gif"/> : null}
        </div>
    )
}
