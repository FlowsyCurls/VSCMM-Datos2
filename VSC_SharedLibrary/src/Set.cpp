#include "Set.h"

Set::Set(const string &id, const string &type, void *vsData, void *vsAddress){
    this->id = id;
    this->type = type;
    this->vsData = vsData;
    this->vsAddress = vsAddress;
}

void Set::toString() const{
    cout << "\n\tvs: " << id << endl
         << "\ttype: " << type << endl
         << "\trefAddress: " << getDataAddress() << endl
         << "\tpointTo: " << pointingTo << endl
         << "\tvalue: " << getValueData() << endl
         << "\trefCount: " << refsList->size() << endl
         << "\t0: " << vsAddress << "  /Authentic" << endl;
    for(int i = 0; i < refsList->size(); i++){
        cout << "\t"<< i+1 << ": " << refsList->at(i) << endl;
    }
//        cout << "---------";
}

void **Set::getDataAddress() const{
    return static_cast<void **>(this->vsData);
}

void **Set::getVsAddress() const {
    return static_cast<void **>(this->vsAddress);
}

string Set::getValueData() const  {
    if (type == "i") {return to_string(*static_cast<int *>(vsData));
    } else if (type == "b") {return to_string(*static_cast<bool *>(vsData));
    } else if (type == "c") {string s(1, *static_cast<char *>(vsData));return s;
    } else if (type == "s") {return to_string(*static_cast<short *>(vsData));
    } else if (type == "l") {return to_string(*static_cast<long *>(vsData));
    } else if (type == "x") {return to_string(*static_cast<long long *>(vsData));
    } else if (type == "f") {return to_string(*static_cast<float *>(vsData));
    } else if (type == "d") {return to_string(*static_cast<double *>(vsData));
    } else if (type == "e") {return to_string(*static_cast<long double *>(vsData));
    } else {cout << "Invalid pointer type" << endl;}
}

void Set::removeAddress(void **address) const {
    for(int i = 0; i < refsList->size(); i++) {
        if (refsList->at(i) == address)
            refsList->removeByInt(i);
    }
}


