import * as React from 'react'
import './App.css'

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

    console.log(sum * (-1))
    console.log(result2)
    let screenWidth = window.innerWidth
    let fieldWidth = screenWidth / size
    let width

    return (
        <div style={{padding: 10}}>
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
            {death ? <img style={{display: "flex",
                justifyContent: "center",
                alignItems: "center", width: "100%"}} src="https://pa1.narvii.com/6921/5349f2694b8efa5212b0c99a324d622cdb35ac38r1-678-382_hq.gif"/> : null}
            {death || sum * (-1) === result2 ? <button style={{
                position: "absolute",
                top: "150px",
                left: "150px",
                backgroundColor: "green",
                width: 100,
                height: 50,
                borderRadius: "50%"
            }} onClick={()=>window.location.reload()}>Новая игра</button> : null}
            {!death ? <img style={{display: "flex",
                justifyContent: "center",
                alignItems: "center", width: "100%"}} src="https://thumbs.gfycat.com/AggravatingDeficientEstuarinecrocodile-size_restricted.gif"/> : null}
            {sum * (-1) === result2 ? <>dfkjg;ldfkjsgl</> : null}
        </div>
    )
}
