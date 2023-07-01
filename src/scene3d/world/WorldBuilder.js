import Resources from "@/res/Resources";
import EventConst from "@/utils/events/EventConst";
import Events from "@/utils/events/Events";
import Ticker from "@/utils/tick/Ticker";
import World from "./World";

export default class WorldBuilder {
    constructor(scene) {
        this.scene = scene;

        this.resource = Resources.getInstance();
        Events.once(EventConst.EVT_SCENE_RES_READY, () => {
            this.onLoaded();
        });
        this.resource.loadGroup('Default');
    }

    onLoaded() {
        Ticker.start();

        this.world = new World();
        this.scene.add(this.world.container);
    }

    update(delta, elapesd) {
        this.world && this.world.update(delta, elapesd);
    }
}