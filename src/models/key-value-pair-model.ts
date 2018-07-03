export class KeyValuePairModel {
    public dataList;

    mapJsonToModel(jsonObj) {
        this.dataList = [];

        for (let data of jsonObj) {
            this.dataList.push(data);
        }
    }
}
