import { useGLTF } from "@react-three/drei";

const HONEY_POT_MODEL_PATH = `${import.meta.env.BASE_URL}models/frasco.glb`

export default function HoneyPot() {

     const honeyPotModel = useGLTF(HONEY_POT_MODEL_PATH)


    return <>
    <primitive
        object={ honeyPotModel.scene }
        scale={0.5}
        position={ [ 0, -0.1, -0.5 ] }
        rotation-y={ 0 }
        rotation-x={ 0.5}
    />
    </>
}

useGLTF.preload(HONEY_POT_MODEL_PATH)
