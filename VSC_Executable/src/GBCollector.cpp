#include "GBCollector.h"

/* Uninitialized. */
GBCollector* GBCollector::instance = nullptr;

GBCollector::GBCollector() {
    cout << "[GBCollector]\tStarted...!\n---------------------------------------\n";
    thread(&GBCollector::sweapThread,this).detach();
}

GBCollector* GBCollector::getInstance() {
    if (instance == nullptr){

        instance = new GBCollector();

    }
    return instance;
}

void GBCollector::sweapThread() {
    while(true){
        this_thread::sleep_for (std::chrono::seconds(7));
        // Sweap then load Json.
        sweapMemoryLeaks();
        generateJson();
    }
}

void GBCollector::generateJson() {
    cout << "\n\n[GBCollector]\tSerializing...!\n---------------------------------------\n";
    json gbJson;
    gbJson["gbSetsList"] = {};
    // Push in each set's json brackets.
    for (int s = 0; s < generalSet->size(); s++) {
        Set *set = generalSet->at(s);
        serializeSetsToJson(gbJson, set, s);
    }// To write object's data members in a file.
    currentPath();
    gbJson["connected"] = 0;
    gbJson["remoteToggle"] = 0;
    gbJson["userInfo"] = {};
    writeJsonFile(gbJson);
    // Print
//    cout << gbJson.find("gbSetsList").value() << endl;
    cout << "---------------------------------------\n";
}

void GBCollector::serializeSetsToJson(json &gbJson, Set* set, int index){
    // Conversion to string of the memory address of the vspointer.
    ostringstream get_the_address;
    get_the_address << set->getVsAddress();
    string vs_dir = get_the_address.str();
    // Conversion to string of the memory address of the T inside the pointer.
    ostringstream get_the_address2;
    get_the_address2 << set->vsData;
    string data_dir = get_the_address2.str();
    //Create an object with required information : jsItem.
    json js;
    js["id"] = set->id;
    js["type"] = set->type;
    js["vsAddress"] = vs_dir;
    js["valAddress"] = data_dir;
    js["value"] = set->getValueData();
    js["refCount"] = set->refsList->size() + 1;
    js["refsList"] = {};
    // Conversion to string of the addresses inside the references list.
    for(int r=0; r < set->refsList->size(); r++) {
        ostringstream get_the_address3;
        get_the_address3 << set->refsList->at(r);
        string refs_dir = get_the_address3.str();
        js["refsList"][r] = refs_dir;
    }
    gbJson["gbSetsList"][index] = js;

}

void GBCollector::writeJsonFile(const json& data){
    path = currentPath()+filename;
    cout << "\n[GB-Path]\tCurrent Path :\t" << path << endl << endl;
    ofstream outfile (filename); // Open in constructor
    outfile << setw(4) <<data << endl;
}


int GBCollector::length() const {
    return setMap->length();
}

void GBCollector::print() const {
    cout << "\n[GBCollector]\tPrinting...!\n---------------------------------------";
    LinkedList<Set *> *everySet = setMap->everySet();
    for(int m=0; m < everySet->size(); m++) {
        if (!everySet->at(m)->pointingTo) {
            everySet->at(m)->toString();
        }
    }
    cout << "---------------------------------------\n";
}

void GBCollector::sweapMemoryLeaks() const {
    cout<< "\n\n[GBCollector]\tSweaping...!\n---------------------------------------\n";
    int leaksCounter = 0;
    for(int a=0; a < generalPtr->size(); a++) {
        bool alone = true;
        for (int b = 0; b < generalSet->size(); b++) {
            if (generalPtr->at(a) == generalSet->at(b)->vsData) {
                alone = false;
            }
        }
        if (alone) {
            auto memoryLeaked = generalPtr->at(a);
            cout << "[GB-Thread]\t\tMemoryLeaks freed\t" << memoryLeaked << endl;
            generalPtr->removeByInt(a);
            free(memoryLeaked);
            leaksCounter++;
        }
    }
    cout << "[GB-Thread]\t\tMemoryLeaks found\t" << leaksCounter << endl;
    cout << "---------------------------------------\n";
}

bool GBCollector::deletePtr(const string &id, void **address) const {
    if(getAuthentic(id) != nullptr){ //authentic
        return true;
    }else { //not authentic
        Set* reference = getRef(id,address);
        if(reference != nullptr){

            return false;
        }
    }return false;
}

Set *GBCollector::getAuthentic(const string &id) const {
    if (setMap->isAuthentic(id)){
        Set* authentic = setMap->getValue(id);
        return authentic;
    }return nullptr;
}

Set *GBCollector::getRef(const string &id, void **address) const {
    if (setMap->isAuthentic(id)) {
        Set *authentic = setMap->getValue(id);
        return authentic;
    }else if (setMap->exist(id)){
        auto refVector = setMap->getKeyVector(id);
        for(int m=0; m < refVector->size(); m++) {
            auto* refSet = refVector->at(m);
            if (refSet->getVsAddress() == address) {
                return refSet;
            }
        }
    }return nullptr;
}

void GBCollector::pushReference(Set *set) const {
    this->setMap->push(set->id,set);
}

void GBCollector::deleteAuthentic(const string &id) const {
    this->setMap->remove(id); //delete a unique key inside the map.
}

void GBCollector::deleteReference(Set *ref) const {
    setMap->remove(ref); //delete ref Set from the map.

}

void GBCollector::update(const string &pointedID, const string &referrerID,
                         void **pointedAddress,void **referrerAddress) const {
    if (setMap->exist(pointedID) && setMap->exist(referrerID) && referrerID != pointedID){
        /* at involved Sets. */
        Set *referrer= getRef(referrerID, referrerAddress); //Referrer : ref that you want to point to another ref.
        Set *pointed = getRef(pointedID, pointedAddress); //Pointed : pointer pointed by the referrer pointer.
        /* remove value from old key & update PointTo of the involved Sets*/
        if (referrer->refsList->isEmpty()){updatePointTo(pointed, referrer);
        }else{updateRefsPointTo(pointed, referrer);}
    }
}

void GBCollector::updateRefsPointTo(Set *pointed, Set *referrer) const {
    auto refVector = setMap->everySet();
    cout << "[Map-Info]\t\t" << referrer->id <<" has  "<< referrer->refsList->size() << "  references." << endl;
    int i=1;
    for(int m=0; m < referrer->refsList->size(); m++) {
        auto* refAddress = referrer->refsList->at(m);
        cout << "\n[Map-Info]\t\t" << "Ref #" << i << endl;
        for(int n=0; n < refVector->size(); n++) {
            auto* prevReferrerSet = refVector->at(n);
            if (prevReferrerSet->getVsAddress() == refAddress) {
                updatePointTo(pointed, prevReferrerSet); //make all its references point to pointed.
            }
        }i++;
    }
    updatePointTo(pointed, referrer); //make the referrer point to pointed.
}

void GBCollector::updatePointTo(Set *pointed, Set *referrer) const {
/* if the referrer does not point to anyone. */
    if (referrer->pointingTo == nullptr) {
        deleteAuthentic(referrer->id); //the referrer is authentic.
    }/* if the referrer does point to someone. */
    else {
        deleteReference(referrer); //remove ref from the hash.
        auto refVector = setMap->everySet();
        for(int m=0; m < refVector->size(); m++) {
            auto* refSet = refVector->at(m);
            if (refSet == referrer->pointingTo)
                refSet->removeAddress(referrer->getVsAddress()); //now quit ref to prev reference.
        }
    }
    /* if the pointer does point to someone. */
    if (pointed->pointingTo != nullptr){
        while (pointed->pointingTo != nullptr) {
            pointed = pointed->pointingTo;
        }
    }
    referrer->pointingTo = pointed;
    pointed->refsList->add(referrer->getVsAddress()); //now referrer refers to what point refers.
    /* renovate id. */
    cout << "[Map-Update]\tKey  \"" << referrer->id << "\"  renovated to  \"" << pointed->id << "\"" << endl;
    referrer->id = pointed->id; //copy id.
    referrer->vsData = pointed->getDataAddress(); //copy data address.
    /* push value with new key. */
    pushReference(referrer);
    cout << endl;
}

string GBCollector::currentPath() {
    long PATH_MAX = pathconf(".", _PC_PATH_MAX);
    char cwd[PATH_MAX];
    if (getcwd(cwd, sizeof(cwd)) != nullptr) {
        string token = cwd;
        string delimiter = "cmake-build-debug";
        string path = token.substr(0, token.find(delimiter));
        return path;
    }
    cout <<"\n[GB-Path]\tPath ERROR!";
    return std::__cxx11::string();
}



